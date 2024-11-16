import React, { useState } from 'react'
import axios from 'axios';

const LoginPage = () => {

    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    const loginHandle = async () => {
        
    }

    return (
        <>
        {/* <Toaster
            position="bottom-right"
        /> */}
        <div className='mt-4 grow flex items-center justify-around'>
            <div className='mb-32'>
                <h1 className='text-4xl text-center mb-4'>Login</h1>
                <form className='max-w-md mx-auto' onSubmit={loginHandle}>
                  <input type='email' placeholder='your@email.com' value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                  <input type='password' placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                  <button className='bg-blue-500 text-white'>Login</button>
                  <div className='text-center py-2 text-gray-500'>Don't have an account yet? <a className='underline text-black' href="/register">Register now</a></div>
                </form>
            </div>
          
        </div>
        </>
      )
}

export default LoginPage
