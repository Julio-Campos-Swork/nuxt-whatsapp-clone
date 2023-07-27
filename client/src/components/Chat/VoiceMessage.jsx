import { HOST } from '@/utils/ApiRoutes'
import { FaPlay, FaStop } from 'react-icons/fa'
import React, { useState, useEffect, useRef } from 'react'
import { useStateProvider } from '@/context/StateContext'
import WaveSufer from 'wavesurfer.js'
import { calculateTime } from '@/utils/CalculateTime'
import MessageStatus from '../common/MessageStatus'
import Avatar from '../common/Avatar'

function VoiceMessage({ message }) {
  const [{ userInfo, currentChatUser }, dispatch] = useStateProvider()

  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(0)
  const [audioMessage, setAudioMessage] = useState(null)

  const waveForm = useRef(null)
  const waveFormRef = useRef(null)

  const handlePlayAudio = () => {
    if (audioMessage) {
      waveForm.current.stop()
      waveForm.current.play()
      audioMessage.play()
      setIsPlaying(true)
    }
  }
  const handlePauseAudio = () => {
    waveForm.current.stop()
    audioMessage.pause()
    setIsPlaying(false)
  }
  useEffect(() => {
    if (waveForm.current === null) {
      waveForm.current = WaveSufer.create({
        container: waveFormRef.current,
        waveColor: '#ccc',
        progressColor: '#4a9eff',
        cursorColor: '#7ae3c3',
        barWidth: 2,
        height: 30,
        responsive: true,
      })

      waveForm.current.on('finish', () => {
        setIsPlaying(false)
      })
    }
    return () => {
      waveForm.current.destroy()
    }
  }, [])

  useEffect(() => {
    const audioUrl = `${HOST}/${message.message}`
    const audio = new Audio(audioUrl)
    setAudioMessage(audio)
    waveForm.current.load(audioUrl)
    waveForm.current.on('ready', () => {
      setTotalDuration(waveForm.current.getDuration())
    })
  }, [message.message])

  useEffect(() => {
    if (audioMessage) {
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(audioMessage.currentTime)
      }
      audioMessage.addEventListener('timeupdate', updatePlaybackTime)
      return () => {
        audioMessage.removeEventListener('timeupdate', updatePlaybackTime)
      }
    }
  }, [audioMessage])

  const formatTime = (time) => {
    if (isNaN(time)) return '00:00'

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`
  }
  return (
    <div
      className={`flex items-center gap-5 text-white px4 pr-2 py-4 text-sm rounded-md ${
        message.senderId === currentChatUser.id
          ? 'bg-incoming-background'
          : 'bg-outgoing-background'
      }`}
    >
      <div>
        <Avatar type="lg" image={currentChatUser?.profilePicture} />
      </div>
      <div className="cursor-poniter text-xl">
        {!isPlaying ? (
          <FaPlay onClick={handlePlayAudio} />
        ) : (
          <FaStop onClick={handlePauseAudio} />
        )}
      </div>
      <div className="relative">
        <div className="w-60" ref={waveFormRef} />
        <div className="text-bubble-meta text-[11px] pat-1 flex justify-between absolute bottom-[-22px] w-full">
          <span>
            {formatTime(isPlaying ? currentPlaybackTime : totalDuration)}
          </span>
          <div className="flex gap-1">
            <span>{calculateTime(message.createdAt)}</span>
            {message.senderId === userInfo.id && (
              <MessageStatus messageStatus={message.messageStatus} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoiceMessage
