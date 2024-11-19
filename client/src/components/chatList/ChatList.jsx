import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { Toaster } from 'react-hot-toast';

const ChatList = ({ setOnline, convoData, onSelectChat, typingCheck, msgWhenOffline }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user:detail')));
  const [chatOpen, setChatOpen] = useState(null);
  const [seenChats, setSeenChats] = useState([]);

  const handleChatOpen = (conversationId) => {

    if(msgWhenOffline.some(x=>x.sendId === userData?.id)){
      setSeenChats(prev => [...prev, conversationId]);
    }
    setChatOpen(conversationId); // Also update the chatOpen state to track the currently opened chat
  };

  function handleSearch() {
    setIsSearching(true);
  }

  function handleCloseSearch() {
    setIsSearching(false);
    setSearchQuery('');
  }

  useEffect(()=>{
    setUserData(userData)
  },[userData])

  // To track the unique users
  const seenUsers = new Set();

  // console.log("Talks;:: ",latestMsg.messages.data[latestMsg.messages.data.length-1].message)

  // Filtered list of conversations without duplicate users
  const filteredData = convoData.filter(({ user }) => {
    if (seenUsers.has(user?.name)) {
      return false; // Skip this user if we have already seen this name
    }
    seenUsers.add(user?.name); // Add the name to the Set
    return true; // Include this item in the filtered list
  });

  return (
    <>
    <Toaster/>
    <div className="w-full sm:w-80 mx-auto font-sans text-gray-800">
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
        filteredData.length > 0 ?
          filteredData
            .filter((chat) =>
              searchQuery === '' ? chat : chat.user.name.toLowerCase().includes(searchQuery.toLocaleLowerCase())
            )
            .map(({ conversationId, user, index }) => {
              // Use conversationId as the key, if available; otherwise fallback to index
              const key = conversationId || index;
              const isSelected = conversationId === chatOpen;
              return (
                <div key={key} className="border-b-[1.5px] cursor-pointer">
                  <div
                    className={`mt-2 flex items-center rounded-lg p-3 mb-2 ${isSelected ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-100`} 
                    onClick={() => {
                      // console.log("userName selected: ", user);
                      onSelectChat(conversationId, user?.name, user?.id);
                        handleChatOpen(conversationId);
                    }}
                  >
                    <div className="w-10 h-10 bg-gray-300 flex justify-center items-center rounded-full mr-3"><PersonOutlineOutlinedIcon/></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div className='flex flex-col'>
                        <span className="font-semibold">{user?.name}</span>
                        {typingCheck?.userId && typingCheck?.userId !== userData.id && typingCheck?.conversationId === conversationId
                ? <span className="text-sm text-blue-500">Typing...</span>
                : <span className="text-sm text-gray-500">{userData.email}</span>}   

{/* {msgWhenOffline.some(x => x.receiveId === user?.id && x.convoId === chatOpen)?<span>Seen</span>:<span>Delivered</span>} */}
                          
            {seenChats.includes(conversationId) 
              ? <span className="text-sm text-green-500">Seen</span>
              : <span className="text-sm text-gray-500">Delivered</span>
            }
                  {/* <span className="text-sm text-gray-500">{userData.email}</span> */}
                        {/* <span className="text-xs text-gray-500">{user?.email}</span> */}
                        </div>
                        <span className={`text-xs ${setOnline.some(x => x.userId === user?.id) ? 'text-green-500 font-semibold':'text-gray-500' }`}>{ setOnline.some(x => x.userId === user?.id) ? 'Online' : 'Offline' }</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          : <div className='text-center text-lg mt-16 font-semibold'>No Conversations</div>
      }
    </div>
  </div>
</div>
</>
  );
}

export default ChatList;
