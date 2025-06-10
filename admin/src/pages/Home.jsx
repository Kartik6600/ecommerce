import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiHome } from 'react-icons/fi'
import { routesConfig } from '../RoutesConfig'
const Home = () => {
    const navigate = useNavigate()
    const homeOptions = routesConfig
        .filter(route => route.path !== '/')
        .map(({ path, icon, label }) => ({
            to: path,
            icon: React.cloneElement(icon, { size: 28 }),
            label,
        }))
    return (
        <div className="px-4 md:p-8 py-4 space-y-10 bg-gradient-to-br from-black to-gray-800 min-h-screen mt-10 sm:mt-0">
            <h1 className="text-4xl font-extrabold text-pink-500 mb-2 flex items-center gap-2 border-b pb-2">
                <FiHome className="text-pink-500" />
                Welcome Admin
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {homeOptions.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(item.to)}
                        className="cursor-pointer group bg-sky-50 border border-[#00bfff] rounded-2xl p-6 shadow-xl backdrop-blur hover:bg-pink-100 transition duration-300 ease-in-out hover:scale-[1.03] flex items-center gap-4"
                    >
                        <div className="bg-indigo-100 text-indigo-700 p-3 rounded-full group-hover:bg-pink-200 group-hover:text-pink-700 transition">
                            {item.icon}
                        </div>
                        <div className="text-lg font-semibold text-indigo-900 group-hover:text-pink-700 transition">
                            {item.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default Home
