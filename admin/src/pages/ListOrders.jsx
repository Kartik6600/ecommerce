import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { FiPackage } from 'react-icons/fi'
import { useLocation } from 'react-router-dom'
import { routesConfig } from '../RoutesConfig'
import Loader from '../components/Loader';
const ListOrders = ({ token }) => {
  const location = useLocation()
  const currentRoute = routesConfig.find(route => route.path === location.pathname)
  const title = currentRoute?.label || 'Page'
  const Icon = currentRoute?.icon || null
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
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
  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? { ...order, status: newStatus, statusHistory: [...order.statusHistory, { status: newStatus }] }
              : order
          )
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };
  useEffect(() => {
    fetchAllOrders();
  }, [token]);
  if (loading) {
    return <Loader message="Loading Orders" />;
  }
  return (
    <div className="px-4 md:p-8 py-4 space-y-10 bg-gradient-to-br from-black to-gray-800 min-h-screen mt-10 sm:mt-0">
      <h1 className="text-4xl font-extrabold text-pink-500 mb-2 flex items-center gap-2 border-b pb-2">
        {Icon && <span className="text-pink-500">{Icon}</span>}
        {title}
      </h1>
      <div className="flex flex-col gap-3">
        {orders.map((order, index) => (
          <div
            key={index}
            className="border border-[#00bfff] rounded-xl p-6 shadow-md grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1.2fr_1fr_1fr] gap-6 bg-sky-50 hover:shadow-lg transition-shadow duration-300"
          >
            <span className="w-14 h-14 flex items-center justify-center border border-[#101049] rounded-md text-[2.5rem] text-pink-500">
              <FiPackage className="object-contain" />
            </span>
            <div className="space-y-1 text-sm text-[#101049]">
              {order.items.map((item, idx) => (
                <p key={idx}>
                  {item.productId.name} x {item.quantity} <span>{item.size}</span>
                  {order.status === 'Delivered' && (
                    item?.rating ? (
                      <span
                        className="flex items-center gap-1 ml-2"
                        title={item?.review || 'No review was written'}
                      >
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={i < item.rating ? 'text-yellow-400' : 'text-gray-300'}
                          >
                            ★
                          </span>
                        ))}
                      </span>
                    ) : (
                      <>
                        <div>
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-rose-600">
                              ★
                            </span>
                          ))}
                        </div>
                      </>
                    )
                  )}
                </p>
              ))}
              <div className="mt-3 font-semibold">
                {order.address.firstName} {order.address.lastName}
              </div>
              <div className="text-sm">
                <p>{order.address.street},</p>
                <p>
                  {order.address.city}, {order.address.state}, {order.address.country} -{' '}
                  {order.address.zipcode}
                </p>
                <p>📞 {order.address.phone}</p>
              </div>
            </div>
            <div className="text-sm text-[#101049] space-y-2">
              <p>🧾 Items: <strong>{order.items.length}</strong></p>
              <p>
                💳 Method: {order.paymentMethod}{' '}
                {order.paymentMethod === 'QR' && (
                  <a
                    href={order.qrimage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 px-2 py-0.5 text-xs border rounded hover:underline hover:text-blue-600"
                  >
                    View QR
                  </a>
                )}
              </p>
              <p>💰 Payment: <strong>{order.payment ? 'Done' : 'Pending'}</strong></p>
              <p>🗓️ Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-lg font-bold text-[#191973]">
              {currency} {order.amount}
            </div>
            <div>
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className="w-full p-2 border border-[#191973] rounded-md bg-white text-sm text-[#191973] font-medium focus:outline-none focus:ring-2 focus:ring-[#191973]"
                disabled={order.status === 'Delivered' || order.status === 'Cancel'}
              >
                {['Pending', 'Accepted', 'Packing', 'Shipped', 'Out of delivery', 'Delivered', 'Cancel'].map(
                  (status, idx, statusOrder) => {
                    const currentStatusIndex = statusOrder.indexOf(order.status);
                    const isCurrent = status === order.status;
                    const isNext = idx === currentStatusIndex + 1;
                    const isCancel = status === 'Cancel' && order.status !== 'Delivered';
                    const alreadyUsed = order.statusHistory.map((s) => s.status).includes(status);
                    let disabled = true;
                    if (isCurrent || isNext || isCancel) disabled = false;
                    if (alreadyUsed && !isCurrent && status !== 'Cancel') disabled = true;
                    if (status === 'Cancel' && order.status === 'Delivered') disabled = true;
                    return (
                      <option key={status} value={status} disabled={disabled}>
                        {status}
                      </option>
                    );
                  }
                )}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ListOrders;