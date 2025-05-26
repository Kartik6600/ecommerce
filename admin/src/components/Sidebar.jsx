import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import { assets } from '../assets/assets';
import { routesConfig } from '../RoutesConfig.jsx'
import { Link } from 'react-router-dom';
const Sidebar = ({ setToken }) => {
  const [isOpen, setIsOpen] = useState(false)
  const navItems = routesConfig.map(({ path, icon, label }) => ({
    to: path,
    icon,
    label,
  }))
  return (
    <>
      <div className="sm:hidden flex items-center justify-between bg-white px-4 py-3 shadow-md fixed top-0 left-0 right-0 z-50 border-b border-[#191973]">
        <h1 className="flex items-center gap-2 text-lg font-semibold text-[#191973]">
          <Link to="/">
          <img
            src={assets.logo1}
            alt="Logo"
            className="h-10 object-contain"
          />
          </Link>
          <Link to="/">
          <img
            src={assets.logo}
            alt="Logo"
            className="h-10 object-contain"
          />
          </Link>
        </h1>
        <button
          className="text-2xl text-[#191973]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
      <div
        className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        sm:translate-x-0 sm:static sm:flex
        w-64 bg-white border-r-2 border-[#191973] shadow-lg flex flex-col`}
      >
        {/* <div className="hidden sm:flex items-center justify-center py-6 text-xl font-bold text-[#bc7598] tracking-wide">
          Admin Panel
        </div> */}
        <div className="flex flex-col gap-3 px-6 py-6 pt-20 sm:pt-6 h-full">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ${isActive
                  ? 'bg-pink-200 text-slate-700'
                  : 'text-[#191973] hover:bg-pink-50'
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <p className="sm:block">{item.label}</p>
            </NavLink>
          ))}
          <div className="sm:hidden mt-auto">
            <button
              onClick={() => {
                setToken('')
                setIsOpen(false)
              }}
              className="w-full bg-pink-100 text-[#101049] border border-[#191973] px-6 py-2 rounded-full text-sm font-semibold transition duration-300 hover:bg-pink-200 hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
export default Sidebar