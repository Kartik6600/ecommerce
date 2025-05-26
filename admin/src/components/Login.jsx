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
    <div className='min-h-screen flex items-center justify-center w-full'>
        <div className='bg-white border border-[#191973] shadow-md rounded-lg px-8 py-6 max-w-md'>
          <h1 className='text-2xl font-bold mb-4 text-[#101049]'> Admin Panel </h1>
          <form onSubmit={onSubmitHandler}>
              <div className='mb-3 min-w-72'>
                  <p className='text-sm font-medium text-[#101049] mb-2'>Email Address</p>
                  <input onChange={(e)=> setEmail(e.target.value)} value={email} className='rounded-md w-full px-3 py-2 border border-[#191973] outline-none text-[#101049] bg-white' type="email" placeholder='your@gmail.com' required/>
              </div>
              <div className='mb-3 min-w-72'>
                  <p className='text-sm font-medium text-[#101049] mb-2'>Password</p>
                  <input onChange={(e)=> setPassword(e.target.value)} value={password} className='rounded-md w-full px-3 py-2 border border-[#191973] outline-none text-[#101049] bg-white' type="password" placeholder='Enter your password' required/>
              </div>
              <button className='mt-2 w-full py-2 px-4 border border-[#191973] rounded-md text-[#101049] bg-[#00bfff]' type="submit"> Login </button>
          </form>
        </div>
    </div>
  )
}
export default Login
