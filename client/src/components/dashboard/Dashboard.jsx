import React, { useEffect, useState } from 'react'
import ChatList from '../chatList/ChatList'
import ChatText from '../chatContent/ChatText'
import axios from 'axios';

const Dashboard = () => {

  useEffect(()=>{
    const fetchData = JSON.parse(localStorage.getItem('user:detail'))
    const fetchTalks = async() => {
      const res = await axios.get(`/api/conversations/${fetchData?.id}`)
      const resData = res;
      console.log('resData :: ', resData.data)
      setTalks(resData.data)
    }
    fetchTalks()
  },[])

  const handleSelectChat = async (chatId, name) => {
    setSelectedChat(chatId);
    setSelectedName(name);
    setMessages([]);

    const resx = await axios.get(`/api/message/${selectedChat}`)
    console.log("RESPONSE IN CHAT-TEXT:::::  ",resx)
    setMessages(resx.data)
  };

  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedName, setSelectedName] = useState('');
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user:detail')));
  const [talks, setTalks] = useState([])
  const [messages, setMessages] = useState([]);

  console.log("Conversations: ",talks)
  console.log("Selected chat id: ", selectedChat)

  return (
    <div className="w-screen flex">
      <div className="w-[8%] flex justify-center border h-screen bg-white">
        <div className="absolute bottom-10 flex flex-col justify-center items-center space-y-4">

          <p className="font-semibold">{userData?.name}</p>
          {/* Profile Image */}
          <div className="border border-blue-700 p-[2px] relative bottom-3 rounded-full">
            <img className="bg-blue-300 border w-14 rounded-full" src="" width={75} height={75}/>    
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              localStorage.removeItem('user:token');
              localStorage.removeItem('user:detail');
              alert("You have been logged out.");
              window.location.href = '/login'; 
            }}
            className="border rounded-lg p-2 mt-4 bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
          >
            Logout
          </button>
          
        </div>
      </div>
          
      <div className="w-[27%] border overflow-y-scroll overflow-x-hidden h-screen">
        <ChatList 
          convoData={talks} onSelectChat={handleSelectChat}
         />
      </div>
          
      <div className="w-[65%] border overflow-y-hidden overflow-x-hidden h-screen">
        <ChatText convoId={selectedName} showMessage={messages}/>
      </div>
    </div>

  )
}

export default Dashboard
