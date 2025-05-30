import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext.jsx";
import {
    FaSearch,
    FaShoppingCart,
    FaHeart,
    FaBars,
    FaChevronLeft,
    FaUserCircle,
    FaBoxOpen,
    FaSignOutAlt,
    FaHome,
    FaThLarge,
    FaInfoCircle,
    FaEnvelope,
} from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { assets } from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";
const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef();
    const {
        setShowSearch,
        getCartCount,
        getWishCount,
        navigate,
        token,
        setToken,
        setCartItems
    } = useContext(ShopContext);
    const logout = () => {
        navigate("/login");
        localStorage.removeItem("token");
        setToken("");
        setCartItems({});
        setVisible(false);
        setProfileOpen(false);
    };
    const navLinkClass = ({ isActive }) =>
        `flex flex-col items-center space-y-1 text-[16px] font-medium transition duration-200 hover:text-pink-500 ${isActive ? "text-pink-500 border-b-2 border-pink-500" : "text-[#FBCFE8]"
        }`;
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setVisible(false);
                setProfileOpen(false);
            }
        };
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const sidebarLinks = [
        { to: "/", label: "HOME", icon: <FaHome /> },
        { to: "/collection", label: "COLLECTION", icon: <FaThLarge /> },
        { to: "/about", label: "ABOUT", icon: <FaInfoCircle /> },
        { to: "/contact", label: "CONTACT", icon: <FaEnvelope /> },
    ];
    const actionLinks = [
        {
            label: "SEARCH",
            icon: <FaSearch />,
            onClick: () => {
                setShowSearch(true);
                setVisible(false);
            }
        },
        {
            label: token ? "PROFILE" : "LOGIN",
            icon: <FiUser />,
            onClick: () => {
                navigate(token ? "/profile" : "/login");
                setVisible(false);
            }
        },
    ];
    if (token) {
        actionLinks.push(
            {
                label: "CART",
                icon: <FaShoppingCart />,
                to: "/cart",
                badge: getCartCount()
            },
            {
                label: "WISHLIST",
                icon: <FaHeart />,
                to: "/wishlist",
                badge: getWishCount()
            },
            {
                label: "ORDERS",
                icon: <FaBoxOpen />,
                onClick: () => {
                    navigate("/orders");
                    setVisible(false);
                }
            },
            {
                label: "LOGOUT",
                icon: <FaSignOutAlt />,
                onClick: logout
            }
        );
    }
    return (
        <header className="shadow-md">
            <div className="flex justify-between items-center px-4 sm:px-8 py-3 max-w-[1400px] mx-auto">
                <div className="flex items-center gap-2 shrink-0">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={assets.logo1} className="h-10 sm:h-12" alt="Logo 1" />
                        <img src={assets.logo} className="h-10 sm:h-12" alt="Logo 2" />
                    </Link>
                </div>
                <nav className="hidden lg:flex justify-center flex-1 gap-6">
                    <NavLink to="/" className={navLinkClass}>HOME</NavLink>
                    <NavLink to="/collection" className={navLinkClass}>COLLECTION</NavLink>
                    <NavLink to="/about" className={navLinkClass}>ABOUT</NavLink>
                    <NavLink to="/contact" className={navLinkClass}>CONTACT</NavLink>
                </nav>
                <div className="hidden lg:flex items-center gap-5">
                    <FaSearch
                        onClick={() => setShowSearch(true)}
                        className="w-5 h-5 cursor-pointer text-[#FBCFE8] hover:text-pink-500 transition"
                    />
                    {token && (<>
                        <Link to="/cart" className="relative">
                            <FaShoppingCart className="w-6 h-6 text-[#FBCFE8] hover:text-pink-500 transition" />
                            {getCartCount() > 0 && (
                                <span className="absolute -right-1 -bottom-1 text-[10px] bg-blue-600 text-white rounded-full h-4 w-4 flex items-center justify-center">
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>
                        <Link to="/wishlist" className="relative">
                            <FaHeart className="w-6 h-6 text-[#FBCFE8] hover:text-pink-500 transition" />
                            {getWishCount() > 0 && (
                                <span className="absolute -right-1 -bottom-1 text-[10px] bg-blue-600 text-white rounded-full h-4 w-4 flex items-center justify-center">
                                    {getWishCount()}
                                </span>
                            )}
                        </Link>
                    </>)}
                    <div className="relative" ref={profileRef}>
                        <FiUser
                            onClick={() => {
                                if (token) {
                                    setProfileOpen(prev => !prev);
                                } else {
                                    navigate("/login");
                                }
                            }}
                            className="w-6 h-6 cursor-pointer text-[#FBCFE8] hover:text-pink-500 transition"
                        />
                        {token && profileOpen && (
                            <div className="absolute right-0 mt-2 z-10 bg-[#1E1B4B] text-[#FBCFE8] rounded shadow-md w-40 p-3 space-y-2">
                                <button onClick={() => { navigate("/profile"); setProfileOpen(false); }} className="flex items-center gap-2 hover:text-pink-500">
                                    <FaUserCircle className="w-4 h-4" />
                                    Profile
                                </button>
                                <button onClick={() => { navigate("/orders"); setProfileOpen(false); }} className="flex items-center gap-2 hover:text-pink-500">
                                    <FaBoxOpen className="w-4 h-4" />
                                    Orders
                                </button>
                                <button onClick={logout} className="flex items-center gap-2 hover:text-pink-500">
                                    <FaSignOutAlt className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center lg:hidden">
                    <FaBars onClick={() => setVisible(true)} className="w-6 h-6 cursor-pointer text-[#FBCFE8]" />
                </div>
            </div>
            <AnimatePresence>
                {visible && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setVisible(false)}
                            className="fixed inset-0 bg-black/40 z-40"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "tween" }}
                            className="fixed top-0 left-0 h-full bg-blue-950 z-50 shadow-md w-4/5 sm:w-1/2 max-w-xs"
                        >
                            <div className="p-4 space-y-5">
                                <button onClick={() => setVisible(false)} className="flex items-center gap-2 text-[#00bfff]">
                                    <FaChevronLeft className="h-4 rotate-180" />
                                    Back
                                </button>
                                {sidebarLinks.map(({ to, label, icon }) => (
                                    <NavLink
                                        key={to}
                                        to={to}
                                        onClick={() => setVisible(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 text-[16px] font-medium transition duration-200 hover:text-pink-500 ${isActive ? "text-pink-500" : "text-[#FBCFE8]"}`
                                        }
                                    >
                                        {icon}
                                        {label}
                                    </NavLink>
                                ))}
                                <hr className="border-t border-[#00bfff] my-4" />
                                {actionLinks.map(({ to, label, icon, onClick, badge }) =>
                                    to ? (
                                        <Link
                                            to={to}
                                            key={label}
                                            onClick={() => setVisible(false)}
                                            className="flex items-center gap-3 text-[16px] font-medium text-[#FBCFE8] hover:text-pink-500 relative"
                                        >
                                            {icon}
                                            {label}
                                            {badge > 0 && (
                                                <span className="absolute right-0 -top-2 text-[10px] bg-blue-600 text-white rounded-full h-4 w-4 flex items-center justify-center">
                                                    {badge}
                                                </span>
                                            )}
                                        </Link>
                                    ) : (
                                        <button
                                            key={label}
                                            onClick={onClick}
                                            className="flex items-center gap-3 text-[16px] font-medium text-[#FBCFE8] hover:text-pink-500"
                                        >
                                            {icon}
                                            {label}
                                        </button>
                                    )
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            <div className="border border-[#FBCFE8]"></div>
        </header>
    );
};
export default Navbar;
