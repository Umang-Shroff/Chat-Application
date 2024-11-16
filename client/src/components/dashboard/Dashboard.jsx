import React, { useEffect } from 'react'
import ChatList from '../chatList/ChatList'
import ChatText from '../chatContent/ChatText'

const Dashboard = () => {

  return (
    <div className="w-screen flex">
      <div className="w-[8%] flex justify-center border h-screen bg-white">
        <div className="absolute bottom-10 flex flex-col justify-center items-center space-y-4">

          {/* Profile Image */}
          <div className="border border-blue-700 p-[2px] rounded-full">
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
        <ChatList/>
      </div>
          
      <div className="w-[65%] border overflow-y-hidden overflow-x-hidden h-screen">
        <ChatText/>
      </div>
    </div>

  )
}

export default Dashboard
