import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

function ChatItem({ name, message, time, isPinned }) {
  return (
    <div className="border-b-[1.5px] cursor-pointer">
    <div
      className={`mt-2 flex items-center rounded-lg p-3  mb-2 ${
        isPinned ? "bg-blue-100" : "hover:bg-gray-100"
      }`}
    >
      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className="font-bold">{name}</span>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
        <div className="text-sm text-gray-600">{message}</div>
      </div>
    </div>
    </div>
  );
}
const ChatList = () => {
    const [isSearching,setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    function handleSearch(){
        setIsSearching(true);
    }

    function handleCloseSearch(){
        setIsSearching(false);
        setSearchQuery('');
    } 

    const chats = [
        { name: "Pink Panda", message: "You: thnx!", time: "9:36"},
        { name: "Dog Hat", message: "It's so quiet outside 🌕", time: "9:36" },
        { name: "Cute Turtle", message: "That's it. Goodbye!", time: "9:36" },
        { name: "Cool Spirit", message: "Look what I found", time: "9:36" },
        { name: "Strange Cat", message: "You: Hi, sorry to bother you...", time: "9:36" },
        { name: "Fire Fox", message: "What does the fox say?", time: "9:36" },
        { name: "Fire Fox", message: "What does the fox say?", time: "9:36" },
        { name: "Fire Fox", message: "What does the fox say?", time: "9:36" },
      ];
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
          <h3 className="text-sm text-gray-500 mt-4 mb-2">All Chats</h3>
          {chats
            .filter((chat) =>
              searchQuery.toLowerCase() === ''
                ? true
                : chat.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((chat, index) => (
              <ChatItem key={index} {...chat} />
            ))}
        </div>
      </div>
    </div>

  )
}

export default ChatList
