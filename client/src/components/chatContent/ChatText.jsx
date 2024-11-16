import React, { useEffect } from 'react'
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import axios from 'axios';

const ChatText = ({ convoName, showMessage }) => {

  return (
    <>
      <div className="fixed top-0 w-full h-[15%] bg-white border-b-[1.5px] shadow-md flex justify-between items-center px-6 z-10">
  <div className="flex items-center gap-4">
  { convoName === '' ? <span></span> : <><img src="#" className="h-12 w-12 bg-gray-300 border rounded-full" />
    <div>
      <h1 className="text-lg font-semibold text-black">{convoName}</h1>
      <span className="text-sm text-gray-500">Online</span>
    </div>
    </>
    }
  </div>
</div>


      <div className="bg-blue-50 w-full h-screen pt-[13%] pb-20 overflow-hidden relative">
        <div className="absolute w-72 h-72 bg-[rgba(79,70,229,0.35)] rounded-full blur-[100px] top-20 left-10"></div>
        <div className="absolute w-96 h-96 bg-[rgba(79,70,229,0.35)] rounded-full blur-[100px] top-1/2 right-10"></div>
        <div className="absolute w-48 h-48 bg-[rgba(79,70,229,0.35)] rounded-full blur-[100px] bottom-10 left-1/2 transform -translate-x-1/2"></div>

        <div className="overflow-y-auto h-[70vh] px-6 relative z-10">
          {
            showMessage.map((message, user)=>{
              console.log("INSIDE MAP FCTN::: ",message)
              if(message.user.name===convoName){
                return(
                    <div className="max-w-[60%] mt-4 bg-white p-4 rounded-xl shadow-md rounded-tl-none">
                      {/* {message} */}{message.message}
                    </div>
                )
              }else{
                return(
                  <div className="max-w-[60%] mt-4 ml-auto bg-blue-500 text-white p-4 rounded-xl rounded-tr-none shadow-md">
                    {/* {message} */}{message.message}
                  </div>
              )
              }
            })
          
          }
          {/* <div className="max-w-[60%] mt-4 bg-white p-4 rounded-xl shadow-md rounded-tl-none">
            Lorem ipsum is simply dummy text of the printing and typesetting industry.
          </div>
          <div className="max-w-[60%] mt-4 ml-auto bg-blue-500 text-white p-4 rounded-xl rounded-tr-none shadow-md">
            Lorem ipsum is simply dummy text of the printing and typesetting industry.
          </div>
          <div className="max-w-[60%] mt-4 bg-white p-4 rounded-xl shadow-md rounded-tl-none">
            Lorem ipsum is simply dummy text of the printing and typesetting industry.
          </div>
          <div className="max-w-[60%] mt-4 ml-auto bg-blue-500 text-white p-4 rounded-xl rounded-tr-none shadow-md">
            Lorem ipsum is simply dummy text of the printing and typesetting industry.
          </div>
          <div className="max-w-[60%] mt-4 bg-white p-4 rounded-xl shadow-md rounded-tl-none">
            Lorem ipsum is simply dummy text of the printing and typesetting industry.
          </div>
          <div className="max-w-[60%] mt-4 ml-auto bg-blue-500 text-white p-4 rounded-xl rounded-tr-none shadow-md">
            Lorem ipsum is simply dummy text of the printing and typesetting industry.
          </div> */}
        </div>
      </div>

      <div className="fixed bottom-0 w-[70%] h-[12%] bg-white border-t-[1.5px] shadow-md flex items-center px-6">
        <input className="h-12 border border-gray-300 focus:border-0 outline-gray-300 rounded-lg px-6 w-[80%] bg-gray-100 text-black" type="text" placeholder="Type a message..." />
        <button type="submit" className="ml-4 w-12 h-12 flex items-center justify-center border rounded-full bg-blue-500 hover:bg-blue-400">
          <SendRoundedIcon className="text-white" />
        </button>
      </div>
    </>
  )
}

export default ChatText
