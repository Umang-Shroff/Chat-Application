import React from 'react'
import ChatList from '../chatList/ChatList'
import ChatText from '../chatContent/ChatText'

const Dashboard = () => {
  return (
    <div className="w-screen flex">
      <div className="w-[8%] flex justify-center border  h-screen bg-white">
        <div className="absolute bottom-10 flex justify-center items-center">
            <div className="border border-blue-700 p-[2px] rounded-full">
                <img className="bg-blue-300 border w-14 rounded-full" src="" width={75} height={75}/>    
            </div>
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
