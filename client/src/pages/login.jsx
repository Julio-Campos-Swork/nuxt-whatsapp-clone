import { useRouter } from 'next/router'
import { CHECK_USER_ROUTE } from '@/utils/ApiRoutes'
import { firebaseAuth } from '@/utils/FirebaseConfig'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { FcGoogle } from 'react-icons/fc'
import axios from 'axios'
import { useStateProvider } from '@/context/StateContext'
import { reducerCases } from '@/context/constants'
function login() {
  const router = useRouter()

  const [{ userInfo, newUser }, dispatch] = useStateProvider()

  useEffect(() => {
    if (userInfo?.id && !newUser) router.push('/')
  }, [userInfo, newUser])
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider()
    const {
      user: { displayName: name, email, photoUrl: profileImage },
    } = await signInWithPopup(firebaseAuth, provider)

    try {
      if (email) {
        const { data } = await axios.post(CHECK_USER_ROUTE, { email })
        // console.log({ data })

        if (!data.status) {
          dispatch({
            type: reducerCases.SET_NEW_USER,
            newUser: true,
          })
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              id: data.id,
              name,
              email,
              profileImage,
              status: '',
            },
          })
          router.push('/onboarding')
        } else {
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
          router.push('/')
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-3">
      <div className="flex items-center justify-center gap-2 text-white">
        {/* <Image src="/whatsapp.gif" alt="whatsapp" width={300} height={300} /> */}
        <span className="text-7xl font-bold">Whatsapp</span>
      </div>
      <button
        onClick={handleLogin}
        className="flex items-center justify-center gap-7 bg-search-input-container-background p-3 rounded-full shadow-md"
      >
        <FcGoogle className="text-4xl" />
        <span className="text-2xl text-white">Login with google</span>
      </button>
    </div>
  )
}

export default login
