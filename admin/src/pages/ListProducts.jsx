import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import EditProductPopup from '../components/EditProductPopup';
import { useLocation } from 'react-router-dom'
import { routesConfig } from '../RoutesConfig'
import Loader from '../components/Loader';
const ListProducts = ({ token }) => {
  const location = useLocation()
  const currentRoute = routesConfig.find(route => route.path === location.pathname)
  const title = currentRoute?.label || 'Page'
  const Icon = currentRoute?.icon || null
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [editPopup, setEditPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(backendUrl + '/api/product/listAdmin', {
        headers: { token },
      });
      if (response.data.success) {
        setList(response.data.products);
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
  const openEditPopup = (productId) => {
    setSelectedProduct(productId);
    setEditPopup(true);
  };
  useEffect(() => {
    fetchList();
  }, []);
  if (loading) {
    return <Loader message="Loading Products" />;
  }
  return (
    <div className="px-4 md:p-8 py-4 space-y-10 bg-gradient-to-br from-gray-50 to-white min-h-screen mt-10 sm:mt-0">
      <h1 className="text-4xl font-extrabold text-[#191973] mb-2 flex items-center gap-2 border-b pb-2">
        {Icon && <span className="text-pink-500">{Icon}</span>}
        {title}
      </h1>
      <div className="flex flex-col gap-3">
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center bg-[#f0f4ff] border border-[#191973] text-[#101049] text-sm font-semibold rounded-md px-4 py-2">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Sub Category</span>
          <span>Price</span>
          <span>Views</span>
          <span>Purchase</span>
          <span className="text-center">Edit</span>
        </div>
        {list.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col md:grid md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-2 px-4 py-2 border border-[#191973] bg-white shadow-sm rounded-lg hover:shadow-md transition duration-200 ${!item.available ? 'opacity-50 grayscale' : ''
              }`}
          >
            <div className="w-full flex items-center md:justify-start">
              <img
                src={item.image[0]}
                alt={item.name}
                className="w-12 h-12 object-cover border rounded-sm"
              />
            </div>
            <p className="w-full text-[#101049] truncate md:text-left text-sm font-medium">
              {item.name}
            </p>
            <p className="w-full text-[#101049] capitalize text-sm">
              {item.category}
            </p>
            <p className="w-full text-[#101049] capitalize text-sm">
              {item.subCategory}
            </p>
            <p className="w-full text-[#101049] text-sm">
              {currency}
              {item.price}
            </p>
            <p className="w-full text-[#101049] text-sm">
              {item.viewCount}
            </p>
            <p className="w-full text-[#101049] text-sm">
              {item.purchaseCount}
            </p>
            <div className="w-full flex justify-end md:justify-center">
              <button
                onClick={() => openEditPopup(item._id)}
                className="inline-flex items-center justify-center p-1 text-blue-600 hover:text-blue-800 transition"
                title="Edit Product"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      {editPopup && (
        <EditProductPopup
          token={token}
          productId={selectedProduct}
          onClose={() => {
            setEditPopup(false);
            fetchList();
          }}
        />
      )}
    </div>
  );
};
export default ListProducts;