import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import { ToastContainer } from 'react-toastify';
import { routesConfig } from './RoutesConfig.jsx'
import 'react-toastify/dist/ReactToastify.css';
export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = '₹';
const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);
  const NotFound = () => (
    <div className="text-center text-red-500 text-xl font-semibold mt-20">
      404 - Page Not Found
    </div>
  );
  return (
    <div className="bg-gradient-to-br from-black to-gray-800 h-screen flex flex-col">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar setToken={setToken} />
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 text-[#101049] text-base">
              <Routes>
                {routesConfig.map(({ path, element: Component }, idx) => (
                  <Route key={idx} path={path} element={<Component token={token} />} />
                ))}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default App;
