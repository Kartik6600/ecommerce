import React, { useState } from 'react'
import { backendUrl } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'
const Login = ({setToken}) => {
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(backendUrl + '/api/user/admin',{email,password})
      if (response.data.success) {
          setToken(response.data.token)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
        toast.error(error.message)
    }
  }
  return (
    <div className='min-h-screen  flex items-center justify-center w-full bg-gradient-to-br from-black to-gray-800'>
        <div className='bg-gradient-to-br from-black to-gray-800 border border-[#FBCFE8] shadow-2xl rounded-lg px-8 py-6 max-w-md'>
          <h1 className='text-2xl font-bold mb-4 text-orange-400'> Admin Panel </h1>
          <form onSubmit={onSubmitHandler}>
              <div className='mb-3 min-w-72'>
                  <p className='text-sm font-medium text-[#00bfff] mb-2'>Email Address</p>
                  <input onChange={(e)=> setEmail(e.target.value)} value={email} className='rounded-md w-full px-3 py-2 border border-[#FBCFE8] outline-none text-pink-400 bg-black' type="email" placeholder='your@gmail.com' required/>
              </div>
              <div className='mb-3 min-w-72'>
                  <p className='text-sm font-medium text-[#00bfff] mb-2'>Password</p>
                  <input onChange={(e)=> setPassword(e.target.value)} value={password} className='rounded-md w-full px-3 py-2 border border-[#FBCFE8] outline-none text-pink-400 bg-black' type="password" placeholder='Enter your password' required/>
              </div>
              <button className='mt-2 w-full py-2 px-4 border border-[#FBCFE8] rounded-md text-[#101049] font-md bg-[#FBCFE8] active:bg-[#bc7598] hover:bg-[#bc7598]' type="submit"> Login </button>
          </form>
        </div>
    </div>
  )
}
export default Login
