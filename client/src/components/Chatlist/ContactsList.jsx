import React, { useEffect, useState } from 'react'
import { GET_ALL_CONTACTS } from '@/utils/ApiRoutes'
import axios from 'axios'
import { BiArrowBack, BiSearchAlt2 } from 'react-icons/bi'
import { useStateProvider } from '@/context/StateContext'
import { reducerCases } from '@/context/constants'
function ContactsList() {
  const [allContacts, setAllContacts] = useState([])
  const [{}, dispatch] = useStateProvider()
  useEffect(() => {
    try {
      const getContacts = async () => {
        const {
          data: { users },
        } = await axios.get(GET_ALL_CONTACTS)
        setAllContacts(users)
      }
      getContacts()
    } catch (error) {
      console.log(error)
    }
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="h-24 flex items-end px-3 py-4">
        <div className="flex items-center gap-12 text-white">
          <BiArrowBack
            className="text-2xl cursor-pointer"
            onClick={() =>
              dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE })
            }
          />
          <span>New Chat</span>
        </div>
      </div>
      {/* barra de busqueda */}
      <div className="bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar">
        <div className="flex py-3 items-center gap-3 h-14">
          <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow mx-4">
            <div>
              <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-l" />
            </div>
            <div>
              <input
                type="text"
                placeholder="Search Contacts"
                className="bg-transparent text-sm focus:outline-none text-white w-full"
              />
            </div>
          </div>
        </div>
        {Object.entries(allContacts).map(([initialLetter, userList]) => {
          return <div></div>
        })}
      </div>
    </div>
  )
}

export default ContactsList