import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';

const LoginPage = () => {

    const navigate = useNavigate();

    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    const loginHandle = async (e) => {
        e.preventDefault()
        try {
            const resp = await axios.post('/api/login',{email, password})
            // alert("Logged")
            console.log(resp)
            if(resp.data.token){
                localStorage.setItem('user:token',JSON.stringify(resp.data.token))
                localStorage.setItem('user:detail',JSON.stringify(resp.data.user))
                navigate('/')
            }
        } catch (error) {
            console.log('Error on LoginPage client: ',error)
        }
    }

    return (
        <>
        {/* <Toaster
            position="bottom-right"
        /> */}
       <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
  <div className="absolute w-72 h-72 bg-[rgba(79,70,229,0.35)] rounded-full blur-[100px] top-10 left-10 sm:w-96 sm:h-96 md:w-[350px] md:h-[350px] lg:w-72 lg:h-72"></div>
  <div className="absolute w-96 h-96 bg-[rgba(79,70,229,0.35)] rounded-full blur-[100px] top-1/2 right-10 sm:w-[400px] sm:h-[400px] md:w-[450px] md:h-[450px] lg:w-96 lg:h-96"></div>
  <div className="absolute w-48 h-48 bg-[rgba(79,70,229,0.35)] rounded-full blur-[100px] bottom-10 left-1/2 transform -translate-x-1/2 sm:w-72 sm:h-72 md:w-[250px] md:h-[250px] lg:w-48 lg:h-48"></div>

  <div className="relative bg-white p-8 rounded-lg shadow-xl z-10 w-full max-w-md">
    <h1 className="text-3xl sm:text-4xl text-center mb-6 text-blue-700 font-semibold">Login</h1>
    <form className="space-y-4 w-full mx-auto" onSubmit={(e) => loginHandle(e)}>
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Login
      </button>
      <div className="text-center py-2 text-gray-500 text-sm sm:text-base">
        Don't have an account yet?{" "}
        <a className="underline text-black" href="/register">
          Register now
        </a>
      </div>
    </form>
  </div>
</div>


        </>
      )
}

export default LoginPage
