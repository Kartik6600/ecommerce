import React from 'react'
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext.jsx';
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const {token, setToken, navigate, backendUrl} = useContext(ShopContext);
    const handleNewPassword = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(backendUrl + '/api/user/resetpassword', {email, newPassword, confirmPassword})
            if (response.data.success) {
                setNewPassword(response.data.newPassword)
                setToken(response.data.token)
                localStorage.setItem('token',response.data.token)
                toast.success('Password reset successfully');
                return navigate('/login');
            } 
            if (newPassword !== confirmPassword) {
                toast.error('Passwords do not match');
            }
        } catch (error) {
            toast.error(error.message) 
        }
    }
  return (
    <>
    <form onSubmit={handleNewPassword} className='flex flex-col item-center w-[90%] sm:max-w-96 m-auto mt-10 my-10 gap-4 text-[#101049]'>
        <div className='inline-flex item-center ml-16 gap-2 mb-2 mt-10'>
            <p className='prata-regular text-3xl text-[#00bfff] '>Forgot Password</p>
            <hr className='border-none h-[1.5px] w-7 mt-5 bg-orange-400'/>
        </div>
      <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" className='bg-zinc-100 w-full px-3 py-2 border-2 border-[#FBCFE8] rounded-md text-[#101049]' placeholder='Email' required />
      <input onChange={(e)=>setNewPassword(e.target.value)} value={newPassword} type="password" className='bg-zinc-100 w-full px-3 py-2 border-2 border-[#FBCFE8] rounded-md text-[#101049]' placeholder='New Password' required />
      <input onChange={(e)=>setConfirmPassword(e.target.value)} value={confirmPassword} type="password" className='bg-zinc-100 w-full px-3 py-2 border-2 border-[#FBCFE8] rounded-md text-[#101049]' placeholder='Confirm New Password' required />
      <p onClick={()=>navigate('/login')}className='cursor-pointer text-[#00bfff]'>Login</p>
      <button className='border border-[#FBCFE8] rounded-md bg-[#FBCFE8] text-[#191973] px-8 py-2 hover:bg-[#F472B6]' type='submit'>Reset Password</button>
    </form>
    </>
  )
}
export default ForgotPassword
