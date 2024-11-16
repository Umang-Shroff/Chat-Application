import React, { useState } from 'react'
import axios from 'axios';


const RegisterPage = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const registerUser = async () => {

    }

    return (
        <>
        {/* <Toaster/> */}
        <div className='mt-4 grow flex items-center justify-around'>
            <div className='mb-32'>
                <h1 className='text-4xl text-center mb-4'>Register</h1>
                <form className='max-w-md mx-auto' onSubmit={registerUser}>
                  <input type="text" placeholder="John Doe" value={name} onChange={(e)=>setName(e.target.value)} required/>
                  <input type='email' placeholder='your@email.com' value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                  <input type='password' placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                  <button className='bg-blue-500 text-white'>Register</button>
                  <div className='text-center py-2 text-gray-500'>Already have an account? <a className='underline text-black' href="/login">Login</a></div>
                </form>
            </div>
          
        </div>
        </>
      )
}

export default RegisterPage
