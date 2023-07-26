import Avatar from '@/components/common/Avatar'
import Input from '@/components/common/Input'
import { useStateProvider } from '@/context/StateContext'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { ONBOARD_USER_ROUTE } from '@/utils/ApiRoutes.js'
import { useRouter } from 'next/router'
import axios from 'axios'
import { reducerCases } from '@/context/constants'
//
function onboarding() {
  const router = useRouter()

  const [{ userInfo, newUser }, dispatch] = useStateProvider()
  const [name, setName] = useState(userInfo?.name || '')
  const [about, setAbout] = useState('')
  const [image, setImage] = useState('/default_avatar.png')

  useEffect(() => {
    if (!newUser && !userInfo?.email) router.push('/login')
    else if (!newUser && userInfo?.email) router.push('/')
  }, [newUser, userInfo, router])

  const onBoardUserHandler = async () => {
    if (validateDetails()) {
      const email = userInfo.email
      try {
        const { data } = await axios.post(ONBOARD_USER_ROUTE, {
          email,
          name,
          about,
          image,
        })
        if (data.status) {
          dispatch({
            type: reducerCases.SET_NEW_USER,
            newUser: false,
          })
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              id: data.user.id,
              name,
              email,
              profileImage: image,
              status: about,
            },
          })
          router.push('/onboarding')
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const validateDetails = () => {
    if (name.length < 3) {
      return false
    }
    return true
  }
  return (
    <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-2">
        {/* <Image src="/whatsapp.gif" alt="whatsapp" width={300} height={300} /> */}
        <span className="text-7xl font-bold">Whatsapp</span>
      </div>
      <h2 className="text-2xl mt-4">Create your profile</h2>
      <div className="flex gap-6 mt-6">
        <div className="flex flex-col items-center justify-center mt-5 gap-6">
          <Input name="Display name" state={name} setState={setName} label />
          <Input name="About" state={about} setState={setAbout} label />
          <div className="flex items-center justify-center">
            <button
              onClick={onBoardUserHandler}
              className="flex items-center justify-center gap-7 bg-search-input-container-background p-3 rounded-full shadow-md"
            >
              Create Profile
            </button>
          </div>
        </div>
        <Avatar type="xl" image={image} setImage={setImage} />
      </div>
    </div>
  )
}

export default onboarding
