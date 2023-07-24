import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { FaCamera } from 'react-icons/fa'
import ContextMenu from './ContextMenu'
import PhotoPicker from './PhotoPicker'
import PhotoLibrary from './PhotoLibrary'
import CapturePhoto from './CapturePhoto'
function Avatar({ type, image, setImage }) {
  const [hover, setHover] = useState()
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false)
  const [contextMenuCordinates, setcontextMenuCordinates] = useState({
    x: 0,
    y: 0,
  })
  const [grabPhoto, setGrabPhoto] = useState(false)
  const [showPhotoLibrary, setShowPhotoLibrary] = useState(false)
  const [showCapturePhoto, setShowCapturePhoto] = useState(false)
  const showContextMenu = (e) => {
    e.preventDefault()
    setcontextMenuCordinates({ x: e.pageX, y: e.pageY })
    setIsContextMenuVisible(true)
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
  const ContextMenuOptions = [
    {
      name: 'Take Photo',
      callback: () => {
        setShowCapturePhoto(true)
      },
    },
    {
      name: 'Choose From Library',
      callback: () => {
        setShowPhotoLibrary(true)
      },
    },
    {
      name: 'Upload Photo',
      callback: () => {
        setGrabPhoto(true)
      },
    },
    {
      name: 'Remove Photo',
      callback: () => {
        setImage('/default_avatar.png')
      },
    },
  ]

  /**
   * The function `photoPickerChange` is an asynchronous function that takes an event object as a
   * parameter and reads the selected file using the FileReader API, then sets the source of an image
   * element to the result of the file read and sets the image source as a data attribute.
   */
  const photoPickerChange = async (e) => {
    console.log(e)
    const file = e.target.files[0]
    const reader = new FileReader()
    const data = document.createElement('img')
    reader.onload = function (event) {
      data.src = event.target.result
      data.setAttribute('data-src', event.target.result)
    }
    reader.readAsDataURL(file)
    setTimeout(() => {
      setImage(data.src)
    }, 100)
  }

  return (
    <>
      <div className="flex item-center justify-center">
        {type === 'sm' && (
          <div className="relative h-10 w-10">
            <Image
              src={image || '/default_avatar.png'}
              alt="avatar"
              className="rounded-full"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              fill
            />
          </div>
        )}
        {type === 'lg' && (
          <div className="relative h-14 w-14">
            <Image
              src={image || '/default_avatar.png'}
              alt="avatar"
              className="rounded-full"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              fill
            />
          </div>
        )}
        {type === 'xl' && (
          <div
            className="relative cursor-pointer z-0"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <div
              className={`z-10 absolute top-0 left-0 bg-photopicker-overlay-background text-2xl cursor-pointer h-60 w-60 flex items-center rounded-full justify-center flex-col text-center gap-2 ${
                hover ? 'visible' : 'hidden'
              }`}
              onClick={(e) => showContextMenu(e)}
              id="context-opener"
            >
              <FaCamera
                className="text-2xl"
                id="context-opener"
                onClick={(e) => showContextMenu(e)}
              />
              <span onClick={(e) => showContextMenu(e)} id="context-opener">
                Change
                <br /> profile
                <br /> photo
              </span>
            </div>
            <div className="flex items-center justify-center h-60 w-60">
              <Image
                src={image || '/default_avatar.png'}
                alt="avatar"
                className="rounded-full"
                fill
              />
            </div>
          </div>
        )}
      </div>
      {isContextMenuVisible && (
        <ContextMenu
          options={ContextMenuOptions}
          cordinates={contextMenuCordinates}
          contextMenu={isContextMenuVisible}
          setContextMenu={setIsContextMenuVisible}
        />
      )}
      {showCapturePhoto && (
        <CapturePhoto
          hideCapturePhoto={setShowCapturePhoto}
          setImage={setImage}
        />
      )}
      {showPhotoLibrary && (
        <PhotoLibrary
          setImage={setImage}
          hidePhotoLibrary={setShowPhotoLibrary}
        />
      )}
      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
    </>
  )
}

export default Avatar
