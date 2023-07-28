import { useStateProvider } from '@/context/StateContext'
import { reducerCases } from '@/context/constants'
import { ADD_MESSAGE_ROUTE, ADD_IMAGE_MESSAGE_ROUTE } from '@/utils/ApiRoutes'
import axios from 'axios'
import React, { useState, useRef, useEffect } from 'react'
import { BsEmojiSmile } from 'react-icons/bs'
import { FaMicrophone } from 'react-icons/fa'
import { ImAttachment } from 'react-icons/im'
import { MdSend } from 'react-icons/md'
import EmojiPicker from 'emoji-picker-react'
import PhotoPicker from '../common/PhotoPicker'
import dynamic from 'next/dynamic'
const CaptureAudio = dynamic(() => import('../common/CaptureAudio'), {
  ssr: false,
})
function MessageBar() {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider()
  const [message, setMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [grabPhoto, setGrabPhoto] = useState(false)
  const [showAudioRecorder, setShowAudioRecorder] = useState(false)
  const emojiPickerRef = useRef(null)
  const handleEmojiModal = () => {
    setShowEmojiPicker(!showEmojiPicker)
  }

  /* The `useEffect` hook in this code is used to handle outside clicks on the emoji picker. */
  useEffect(() => {
    const hanldeOutsideClick = (event) => {
      if (event.target.id !== 'emoji-open') {
        if (
          emojiPickerRef.current &&
          !emojiPickerRef.current.contains(event.target)
        ) {
          setShowEmojiPicker(false)
        }
      }
    }
    document.addEventListener('click', hanldeOutsideClick)
    return () => {
      document.removeEventListener('click', hanldeOutsideClick)
    }
  }, [])

  const handleEmojiClick = (emoji) => {
    setMessage((prevMessage) => (prevMessage += emoji.emoji))
  }
  /**
   * The function `sendMessage` sends a message to a chat user using an HTTP POST request and emits a
   * socket event to notify other users.
   */
  const sendMessage = async () => {
    console.log({ currentChatUser })
    try {
      const { data } = await axios.post(ADD_MESSAGE_ROUTE, {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message,
      })
      // console.log({ data })
      socket.current.emit('send-msg', {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message: data.message,
      })
      dispatch({
        type: reducerCases.ADD_MESSAGE,
        newMessage: { ...data.message },
        fromSelf: true,
      })
      setMessage('')
    } catch (error) {
      console.log(error)
    }
  }

  //photopicker
  /**
   * The function `photoPickerChange` is an asynchronous function that takes an event object as a
   * parameter and reads the selected file using the FileReader API, then sets the source of an image
   * element to the result of the file read and sets the image source as a data attribute.
   */
  const photoPickerChange = async (e) => {
    try {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('image', file)
      const response = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          from: userInfo?.id,
          to: currentChatUser?.id,
        },
      })
      if (response.status === 201) {
        socket.current.emit('send-msg', {
          to: currentChatUser?.id,
          from: userInfo?.id,
          message: response.data.message,
        })
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: { ...response.data.message },
          fromSelf: true,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById('photo-picker')
      data.click()
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false)
        }, 1000)
      }
    }
  }, [grabPhoto])
  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      {!showAudioRecorder && (
        <>
          <div className="flex gap-6">
            <BsEmojiSmile
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Emoji"
              id="emoji-open"
              onClick={handleEmojiModal}
            />
            {showEmojiPicker && (
              <div
                className="absolute bottom-24  left-16 z-40"
                ref={emojiPickerRef}
              >
                <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
              </div>
            )}
            <ImAttachment
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Attach File"
              onClick={() => setGrabPhoto(!grabPhoto)}
            />
          </div>
          <div className="w-full rounded-lg h-10 flex items-center">
            <input
              type="text"
              placeholder="Type a message"
              className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
          </div>
          <div className="flex w-10 items-center justify-center">
            <button>
              {message?.length ? (
                <MdSend
                  className="text-panel-header-icon cursor-pointer text-xl"
                  title="Send Message"
                  onClick={sendMessage}
                />
              ) : (
                <FaMicrophone
                  className="text-panel-header-icon cursor-pointer text-xl"
                  title="Record Audio"
                  onClick={() => setShowAudioRecorder(true)}
                />
              )}
            </button>
          </div>
        </>
      )}
      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
      {showAudioRecorder && <CaptureAudio hide={setShowAudioRecorder} />}
    </div>
  )
}

export default MessageBar
