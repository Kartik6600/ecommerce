import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../assets/assets";
import { FcGoogle } from "react-icons/fc";
import '../index.css'
const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        const fullName = `${firstName.trim()} ${lastName.trim()}`;
        const response = await axios.post(backendUrl + '/api/user/register', {
          name: fullName,
          email,
          password
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Account Created Successfully');
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Login Successfully');
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);
  return (
    <motion.form
      onSubmit={onSubmitHandler}
      className='w-[90%] max-w-md mx-auto my-10 px-4 py-6 flex flex-col gap-4 text-gray-800'
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <motion.div
        className='flex items-center gap-2 mb-2 justify-center'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className='prata-regular text-3xl text-[#101049]'>{currentState}</p>
        <hr className='border-none h-[2px] w-7 mt-2 bg-[#101049]' />
      </motion.div>
      <AnimatePresence mode="wait">
        {currentState === 'Sign Up' && (
          <>
            <motion.div
              key="firstName"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4 }}
            >
              <input
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                type="text"
                placeholder="First Name"
                className="input-style"
                required
              />
            </motion.div>
            <motion.div
              key="lastName"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <input
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                type="text"
                placeholder="Last Name"
                className="input-style"
                required
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <motion.input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        placeholder="Email"
        className="input-style"
        required
        whileFocus={{ scale: 1.03 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />
      <motion.input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        placeholder="Password"
        className="input-style"
        required
        whileFocus={{ scale: 1.03 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      />
      <motion.div
        className='w-full flex justify-between text-sm -mt-1 px-1'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
      >
        <p onClick={() => navigate('/forgotpassword')} className='cursor-pointer text-[#101049] hover:underline'>Forgot password?</p>
        <p
          onClick={() => setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')}
          className='cursor-pointer text-[#101049] hover:underline'
        >
          {currentState === 'Login' ? 'Create account' : 'Login Here'}
        </p>
      </motion.div>
      <motion.button
        type="submit"
        className='bg-sky-300 text-[#101049] border border-[#191973] rounded-md hover:bg-pink-200 hover:text-[#191973] font-light px-8 py-2 mt-2'
        whileHover={{ scale: 1.05, backgroundColor: "#f9a8d4", transition: { duration: 0.3 } }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
      </motion.button>
      <motion.div
        className="mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <button
          onClick={() => window.location.href = `${backendUrl}/api/user/auth/google`}
          className="w-full flex items-center justify-center gap-2 bg-white border border-[#191973] rounded-md py-2 px-4 hover:bg-gray-50"
        >
          <FcGoogle />
          Continue with Google
        </button>
      </motion.div>
    </motion.form>
  );
};
export default Login;
