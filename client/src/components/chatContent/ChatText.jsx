import React, { useEffect, useState } from 'react'
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import axios from 'axios';

const ChatText = ({ convoName, receiverId, senderName, convoId, showMessage }) => {

  const [typedText, setTypedText] = useState('');
  const [messagesArray, setMessagesArray] = useState(showMessage)

  // console.log("SLEEEEEEP::: ",messagesArray)

  const sendMessage = async () => {
    try {
      const res = await axios.post('/api/message',{ conversationId:convoId ,senderId:senderName, message:typedText, receiverId:receiverId})
      console.log("New message typed: ",res);
      setTypedText('')
    } catch (error) {
      console.log("Error in posting new message: ",error)
    }
  }

  // console.log("showMessage: ",messagesArray)


  return (
    <>
      
      
    </>
  )
}

export default ChatText
