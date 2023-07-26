import React, { useState, useEffect, useRef } from 'react'
import ChatList from './Chatlist/ChatList'
import Empty from './Empty'
import { onAuthStateChanged } from 'firebase/auth'
import { firebaseAuth } from '@/utils/FirebaseConfig'
import axios from 'axios'
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from '@/utils/ApiRoutes'
import { useRouter } from 'next/router'
import { useStateProvider } from '@/context/StateContext'
import { reducerCases } from '@/context/constants'
import Chat from './Chat/Chat'
import { io } from 'socket.io-client'

// inicio
function Main() {
  const router = useRouter()
  const [redirectLogin, setRedirectLogin] = useState(false)
  const [{ userInfo, currentChatUser }, dispatch] = useStateProvider()
  const [socketEvent, setSocketEvent] = useState(false)
  const socket = useRef()

  /* The `useEffect` hook is used to perform side effects in a functional component. In this case, the
  effect is triggered whenever the value of `redirectLogin` changes. */
  useEffect(() => {
    if (redirectLogin) router.push('/login')
  }, [redirectLogin])

  /* The `onAuthStateChanged` function is a Firebase authentication method that listens for changes in
  the user's authentication state. It takes two arguments: the `firebaseAuth` object and a callback
  function that will be executed whenever the authentication state changes. */
  onAuthStateChanged(firebaseAuth, async (currentUser) => {
    if (!currentUser) setRedirectLogin(true)
    if (!userInfo && currentUser?.email) {
      const { data } = await axios.post(CHECK_USER_ROUTE, {
        email: currentUser.email,
      })
      if (!data.status) {
        router.push('/login')
      }
      if (data?.data) {
        const {
          id,
          name,
          email,
          profilePicture: profileImage,
          status,
        } = data.data
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {
            id,
            name,
            email,
            profileImage,
            status,
          },
        })
      }
    }
  })

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST)
      socket.current.emit('add-user', userInfo.id)
      dispatch({ type: reducerCases.SET_SOCKET, socket })
    }
  }, [userInfo])

  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on('msg-recieve', (data) => {
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: { ...data.message },
        })
      })
      setSocketEvent(true)
    }
  }, [socket.current])

  useEffect(() => {
    const getMessages = async () => {
      const {
        data: { messages },
      } = await axios.get(
        `${GET_MESSAGES_ROUTE}/${userInfo.id}/${currentChatUser.id}`
      )
      dispatch({ type: reducerCases.SET_MESSAGES, messages })
      console.log({ data: messages })
    }
    if (currentChatUser?.id) {
      getMessages()
    }
  }, [currentChatUser])

  return (
    <>
      <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full over">
        <ChatList />
        {/* <Empty /> */}
        {currentChatUser ? <Chat /> : <Empty />}
      </div>
    </>
  )
}

export default Main
