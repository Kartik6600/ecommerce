import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import EditCouponPopup from '../components/EditCouponPopup';
import { MdEdit } from "react-icons/md";
import { ImCross } from "react-icons/im";
const getFormattedDate = (date) => new Date(date).toLocaleDateString('en-CA');
import { useLocation } from 'react-router-dom'
import { routesConfig } from '../RoutesConfig'
import Loader from '../components/Loader';
const ListCoupons = ({ token }) => {
  const location = useLocation()
  const currentRoute = routesConfig.find(route => route.path === location.pathname)
  const title = currentRoute?.label || 'Page'
  const Icon = currentRoute?.icon || null
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editCoupon, setEditCoupon] = useState({ id: '', start: '', expiry: '' });
  const [originalStartDate, setOriginalStartDate] = useState(null);
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/coupon/list`, {
        headers: { token },
      });
      if (response.status === 200) {
        setCoupons(response.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally { 
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };
  useEffect(() => {
    fetchCoupons();
  }, []);
  const openEditDialog = (coupon) => {
    const startDate = new Date(coupon.start);
    const expiryDate = new Date(coupon.expiry);
    setEditCoupon({
      id: coupon._id,
      name: coupon.name,
      code: coupon.code,
      discount: coupon.discount,
      start: startDate,
      expiry: expiryDate,
    });
    setOriginalStartDate(startDate);
    setEditDialogOpen(true);
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { id, start, expiry } = editCoupon;
      const response = await axios.post(
        `${backendUrl}/api/coupon/update`,
        { id, start, expiry },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setEditDialogOpen(false);
        await fetchCoupons();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const removeCoupon = async (id) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/coupon/remove`, {
        data: { id },
        headers: { token },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchCoupons();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const getCouponStatus = (start, expiry) => {
    const today = new Date();
    const startDate = new Date(start);
    const expiryDate = new Date(expiry);
    return (
      <svg
        title={
          today < startDate
            ? 'Upcoming'
            : today > expiryDate
              ? 'Expired'
              : 'Active'
        }
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={
          today < startDate ? '#FFCE1B' : today > expiryDate ? 'red' : '#008F00'
        }
        className="w-6 h-6"
      >
        <circle cx="12" cy="12" r="10" />
      </svg>
    );
  };
  if (loading) {
    return <Loader message="Loading Coupons" />;
  }
  return (
    <div className="px-4 md:p-8 py-4 space-y-10 bg-gradient-to-br from-gray-50 to-white min-h-screen mt-10 sm:mt-0">
      <h1 className="text-4xl font-extrabold text-[#191973] mb-2 flex items-center gap-2 border-b pb-2">
        {Icon && <span className="text-pink-500">{Icon}</span>}
        {title}
      </h1>
      <div className="flex flex-col gap-3">
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center bg-[#f0f4ff] border border-[#191973] text-[#101049] text-sm font-semibold rounded-md px-4 py-2">
          <span>Name</span>
          <span>Code</span>
          <span>Discount</span>
          <span>Start</span>
          <span>Expiry</span>
          <span className="text-center">Status</span>
          <span className="text-center">Usage</span>
          <span className="text-center">Edit</span>
          <span className="text-center">Remove</span>
        </div>
        {coupons.map((item, index) => (
          <div
            key={index}
            className="grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] grid-cols-1 gap-y-2 px-4 py-3 border border-[#191973] bg-white shadow-sm rounded-lg hover:shadow-md transition duration-200"
          >
            <div className="md:hidden flex flex-col text-sm text-[#101049] gap-1">
              <p><span className="font-semibold">Name:</span> {item.name}</p>
              <p><span className="font-semibold">Code:</span> {item.code}</p>
              <p><span className="font-semibold">Discount:</span> {item.discount}%</p>
              <p><span className="font-semibold">Start:</span> {getFormattedDate(item.start)}</p>
              <p><span className="font-semibold">Expiry:</span> {getFormattedDate(item.expiry)}</p>
              <p className="flex items-center gap-1">
                <span className="font-semibold">Status:</span> {getCouponStatus(item.start, item.expiry)}
              </p>
              <p><span className="font-semibold">Usage:</span> {item.useCount}</p>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => openEditDialog(item)}
                  title="Edit Coupon"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <MdEdit />
                </button>
                <button
                  onClick={() => removeCoupon(item._id)}
                  title="Remove Coupon"
                  className="text-red-600 hover:text-red-800"
                >
                  <ImCross />
                </button>
              </div>
            </div>
            <p className="hidden md:block text-[#101049] truncate">{item.name}</p>
            <p className="hidden md:block text-[#101049]">{item.code}</p>
            <p className="hidden md:block text-[#101049]">{item.discount}%</p>
            <p className="hidden md:block text-[#101049]">{getFormattedDate(item.start)}</p>
            <p className="hidden md:block text-[#101049]">{getFormattedDate(item.expiry)}</p>
            <div className="hidden md:flex justify-center">{getCouponStatus(item.start, item.expiry)}</div>
            <p className="hidden md:flex justify-center text-[#101049]">{item.useCount}</p>
            <div className="hidden md:flex justify-center">
              <button
                onClick={() => openEditDialog(item)}
                title="Edit Coupon"
                className="text-blue-600 hover:text-blue-800"
              >
                <MdEdit size={24} />
              </button>
            </div>
            <div className="hidden md:flex justify-center">
              <button
                onClick={() => removeCoupon(item._id)}
                title="Remove Coupon"
                className="text-red-600 hover:text-red-800"
              >
                <ImCross />
              </button>
            </div>
          </div>
        ))}
      </div>
      {editDialogOpen && (
        <EditCouponPopup
          editCoupon={editCoupon}
          setEditCoupon={setEditCoupon}
          originalStartDate={originalStartDate}
          handleEditSubmit={handleEditSubmit}
          closeDialog={() => setEditDialogOpen(false)}
        />
      )}
    </div>
  );
};
export default ListCoupons;
