import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom'
import { routesConfig } from '../RoutesConfig'
import Loader from '../components/Loader';
const ListUsers = ({ token }) => {
  const location = useLocation()
  const currentRoute = routesConfig.find(route => route.path === location.pathname)
  const title = currentRoute?.label || 'Page'
  const Icon = currentRoute?.icon || null
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(backendUrl + '/api/user/list', {
        headers: { token },
      });
      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }finally { 
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  if (loading) {
    return <Loader message="Loading Users" />;
  }
  return (
    <div className="px-4 md:p-8 py-4 space-y-10 bg-gradient-to-br from-gray-50 to-white min-h-screen mt-10 sm:mt-0">
      <h1 className="text-4xl font-extrabold text-[#191973] mb-2 flex items-center gap-2 border-b pb-2">
        {Icon && <span className="text-pink-500">{Icon}</span>}
        {title}
      </h1>
      <div className="flex flex-col gap-3">
        <div className="hidden md:grid grid-cols-[1fr_2fr_2fr_1fr_1fr_1fr_1fr_1fr] items-center bg-[#f0f4ff] border border-[#191973] text-[#101049] text-sm font-semibold rounded-md px-4 py-2">
          <span>Image</span>
          <span>Name</span>
          <span>Email</span>
          <span>Phone</span>
          <span>Login</span>
          <span>Cart</span>
          <span>Wishlist</span>
          <span>Orders</span>
        </div>
        {users.map((user, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-[1fr_2fr_2fr_1fr_1fr_1fr_1fr_1fr] items-center gap-2 px-4 py-2 border border-[#191973] bg-white shadow-sm rounded-lg hover:shadow-md transition duration-200"
          >
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="User"
                className="w-12 h-12 object-cover rounded-full border-2 border-[#191973] mx-auto md:mx-0"
              />
            ) : (
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#dbe1ff] text-[#191973] text-lg font-bold border-2 border-[#191973] mx-auto md:mx-0">
                {user.name?.[0] || 'U'}
              </div>
            )}
            <div className="md:hidden text-[#101049] text-sm flex flex-col gap-1 col-span-full">
              <p><span className="font-semibold">Name:</span> {user.name}</p>
              <p><span className="font-semibold">Email:</span> {user.email}</p>
              <p><span className="font-semibold">Phone:</span> {user.phone || 'N/A'}</p>
              <p><span className="font-semibold">Login:</span> {user.loginCount}</p>
              <p><span className="font-semibold">Cart:</span> {user.cartData?.length || 0}</p>
              <p><span className="font-semibold">Wishlist:</span> {user.wishlist?.length || 0}</p>
              <p><span className="font-semibold">Orders:</span> {user.orders?.length || 0}</p>
            </div>
            <p className="hidden md:block text-[#101049] truncate">{user.name}</p>
            <p className="hidden md:block text-[#101049] truncate">{user.email}</p>
            <p className="hidden md:block text-[#101049]">{user.phone || 'N/A'}</p>
            <p className="hidden md:block text-[#101049]">{user.loginCount}</p>
            <p className="hidden md:block text-[#101049]">{user.cartData?.length || 0}</p>
            <p className="hidden md:block text-[#101049]">{user.wishlist?.length || 0}</p>
            <p className="hidden md:block text-[#101049]">{user.orders?.length || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ListUsers;
