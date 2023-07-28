import { useStateProvider } from '@/context/StateContext'
import { reducerCases } from '@/context/constants'
import { GET_INITIAL_CONTACTS_ROUTE } from '@/utils/ApiRoutes'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import ChatLIstItem from './ChatLIstItem'
import { MdConnectWithoutContact } from 'react-icons/md'

function List() {
  const [{ userInfo, userContacts, filteredContacts }, dispatch] =
    useStateProvider()

  useEffect(() => {
    const getContacts = async () => {
      try {
        const {
          data: { users, onlineUsers },
        } = await axios(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo.id}`)
        dispatch({ type: reducerCases.SET_ONLINE_USERS, onlineUsers })
        dispatch({ type: reducerCases.SET_USER_CONTACTS, userContacts: users })
      } catch (error) {
        console.log(error)
      }
    }
    if (userInfo) getContacts()
  }, [userInfo])
  return (
    <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
      {userContacts.length < 0 && (
        <div className="flex justify-center h-full flex-col">
          <span className="text-secondary w-full flex justify-center">
            No conversations yet
          </span>
        </div>
      )}
      {filteredContacts && filteredContacts.length > 0
        ? filteredContacts.map((contact) => {
            return <ChatLIstItem data={contact} key={contact.id} />
          })
        : userContacts.map((contact) => {
            return <ChatLIstItem data={contact} key={contact.id} />
          })}
    </div>
  )
}

export default List
