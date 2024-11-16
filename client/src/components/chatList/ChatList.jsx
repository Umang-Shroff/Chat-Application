import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import axios from 'axios';

const ChatList = ({ convoData, onSelectChat }) => {
    const [isSearching,setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [messages, setMessages] = useState('');

    function handleSearch(){
        setIsSearching(true);
    }

    function handleCloseSearch(){
        setIsSearching(false);
        setSearchQuery('');
    } 

  return (
    <div className="w-80 mx-auto font-sans text-gray-800">
      <header className="flex justify-between items-center p-6 border-b-[1.5px] bg-white shadow-md">
        {isSearching ? (
          <div className="flex w-full items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query
              placeholder="Search..."
              className="border p-2 border-gray-400 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <CancelOutlinedIcon
              className="ml-3 cursor-pointer opacity-80 hover:opacity-100"
              onClick={handleCloseSearch}
            />
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold">Chats</h2>
            <div
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer"
              onClick={handleSearch}
            >
              <SearchIcon />
            </div>
          </>
        )}
      </header>

      <div className="p-4">
        <div>
          <h3 className="text-sm text-blue-500 mt-4 mb-2">All Chats</h3>
          {
          convoData.length > 0 ?
          convoData
            .filter((chat) =>
              searchQuery === '' ? chat : chat.user.name.toLowerCase().includes(searchQuery.toLocaleLowerCase())
            )
            .map(({conversationId, user, index}) => {
              // <ChatItem key={index} {...chat} />
              return(
                <div key={index} className="border-b-[1.5px] cursor-pointer">
                  <div
                    className='mt-2 flex items-center rounded-lg p-3  mb-2 hover:bg-gray-100' onClick={()=>onSelectChat(conversationId, user?.name)}
                  >
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{user?.name}</span>
                        <span className="text-xs text-gray-500">{user?.email}</span>
                      </div>
                      {/* <div className="text-sm text-gray-600">{message}</div> */}
                    </div>
                  </div>
                </div>
              )
          }) : <div className='text-center text-lg mt-16 font-semibold'>No Conversations</div>        } 
        </div>
      </div>
    </div>

  )
}

export default ChatList
