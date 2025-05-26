import React from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';
const Navbar = ({ setToken }) => {
  return (
    <>
      <nav className="hidden sm:flex items-center justify-between py-4 px-[5%] bg-white shadow-md">
        <Link to="/">
        <img
          src={assets.logo1}
          alt="Left Logo"
          className="h-20 object-contain"
        />
        </Link>
        <Link to="/">
        <img
          src={assets.logo}
          alt="Center Logo"
          className="h-16 sm:h-20 object-contain"
        />
        </Link>
        <button
          onClick={() => setToken('')}
          className="bg-pink-100 text-[#101049] border border-[#191973] px-6 py-2 sm:px-8 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition duration-300 hover:bg-pink-200 hover:shadow-lg"
        >
          Logout
        </button>
      </nav>
      <hr className="hidden sm:block border-t border-[#191973]" />
    </>
  );
};
export default Navbar;
