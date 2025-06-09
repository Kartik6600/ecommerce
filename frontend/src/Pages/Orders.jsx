import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import Title from "../components/Title";
import axios from "axios";
import { Link } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { assets } from "../assets/assets";
import { toast } from "react-toastify"
import "../index.css"
const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [pdfDataUrl, setPdfDataUrl] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const loadOrderData = async () => {
    try {
      if (!token) return;
      const response = await axios.post(
        backendUrl + '/api/order/userorders',
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrderData(response.data.orders.reverse());
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };
  useEffect(() => {
    loadOrderData();
  }, [token]);
  const getFormattedDate = (date) =>
    new Date(date).toLocaleDateString();
  const getFormattedTime = (date) => {
    const d = new Date(date);
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;
  };
  const StatusStepper = ({ statusHistory, status }) => {
    const ORDER_STATUSES = ['Pending', 'Accepted', 'Packing', 'Shipped', 'Out of delivery', 'Delivered'];
    const completedStatuses = Array.isArray(statusHistory)
      ? statusHistory.map(s => s.status)
      : [];
    const isCancelled = status === 'Cancel';
    const displayStatuses = isCancelled ? [...ORDER_STATUSES, 'Cancel'] : ORDER_STATUSES;
    return (
      <div className="w-full overflow-x-auto">
        <div className="flex min-w-[600px] items-center justify-between mt-4 relative px-2">
          {displayStatuses.map((step, index) => {
            const stepStatus = completedStatuses.includes(step);
            const isDelivered = step === 'Delivered' && status === 'Delivered';
            const isCancelledStep = step === 'Cancel';
            const dateObj = statusHistory?.find(s => s.status === step)?.createdAt;
            const date = dateObj ? new Date(dateObj) : null;
            let circleColor = '#c0c0c0';
            if (isCancelled) {
              if (isCancelledStep || !stepStatus) {
                circleColor = '#ff4d4f';
              } else {
                circleColor = '#101049';
              }
            } else {
              circleColor = stepStatus ? (isDelivered ? 'green' : '#101049') : '#c0c0c0';
            }
            return (
              <div key={index} className="flex-1 flex flex-col items-center text-center relative">
                <div
                  className="w-4 h-4 rounded-full z-10"
                  style={{ backgroundColor: circleColor }}
                ></div>
                <p className={`text-xs mt-1 ${isCancelledStep && isCancelled ? 'text-red-600' : 'text-[#101049]'}`}>
                  {step}
                </p>
                <p className="text-[10px] text-gray-500">{date ? getFormattedDate(date) : '–'}</p>
                <p className="text-[10px] text-gray-500">{date ? getFormattedTime(date) : '–'}</p>
                {index < displayStatuses.length - 1 && (
                  <div
                    className="absolute top-2 left-1/2 translate-x-0 w-full h-0.5 bg-gray-300"
                    style={{ zIndex: 0 }}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  const toggleStepper = (orderId) => {
    setActiveOrderId(activeOrderId === orderId ? null : orderId);
  };
  const viewReceipt = async (orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/receipt/${orderId}`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setReceiptData(response.data);
        setShowReceiptModal(true);
        setTimeout(() => {
          const element = document.getElementById("receipt-content");
          const opt = {
            margin: 5,
            filename: `receipt-${orderId}.pdf`,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: {
              scale: 2,
              scrollY: 0,
              windowWidth: element.scrollWidth,
              windowHeight: element.scrollHeight,
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
          };
          html2pdf()
            .set(opt)
            .from(element)
            .toPdf()
            .output('datauristring')
            .then((dataUrl) => {
              setPdfDataUrl(dataUrl);
            })
            .catch((error) => {
              console.error("PDF generation failed:", error);
            });
        }, 100);
      }
    } catch (err) {
      console.error("Error loading receipt:", err);
    }
  };
  const closeReceiptModal = () => {
    setShowReceiptModal(false);
    setReceiptData(null);
    setPdfDataUrl(null);
  };
  const downloadReceiptPDF = () => {
    if (!pdfDataUrl) return;
    const link = document.createElement('a');
    link.href = pdfDataUrl;
    link.download = `receipt-${receiptData.order._id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <>
      <div className="py-10 px-4 sm:px-8 text-[#101049]">
        <div className="text-2xl mb-8">
          <Title text1={'MY'} text2={'ORDERS'} />
        </div>
        <div className="space-y-6">
          {orderData.map((order) => (
            <div key={order._id} className="bg-zinc-100 border-2 border-[#FBCFE8] rounded-md p-4 shadow-md">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <div className="flex flex-col gap-4 w-full">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <Link className='cursor-pointer bg-zinc-100' to={`/product/${item.productId._id}`}>
                        <img src={item.productId.image[0]} alt={item.name} className="w-20 h-20 object-cover border rounded-md" />
                        <div>
                          <p className="font-medium">{item.productId.name}</p>
                          <div className="text-sm mt-1">
                            <p>Item Price: {currency}{item.price}</p>
                            <p>Quantity : {item.quantity} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Size: {item.size}</p>
                          </div>
                        </div>
                        {item?.rating &&
                          <div className="mb-4">
                            <label className="block mb-2 font-medium">Rating:</label>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={`text-2xl ${item.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                        }
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-start sm:items-end justify-between gap-2 sm:w-1/3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          order.status === 'Delivered' ? 'green' :
                            order.status === 'Cancel' ? '#ff4d4f' : '#facc15'
                      }}
                    />
                    <span className="text-sm">{order.status}</span>
                  </div>
                  <button
                    onClick={() => toggleStepper(order._id)}
                    className="mt-2 px-4 py-2 border border-[#191973] bg-[#101049] text-sm font-medium text-[#ffffff] rounded hover:bg-[#00bfff] hover:text-[#101049] transition"
                  >
                    Track Order
                  </button>
                  {order.status === 'Delivered' && order.items.every(item => item.rating === null) && (
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowReviewModal(true);
                      }}
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                      Add Review
                    </button>
                  )}
                  <div className="relative group inline-block">
                    <button
                      onClick={() => viewReceipt(order._id)}
                      className="mt-2 px-4 py-2 text-sm font-medium text-[#101049] rounded hover:bg-[#101049] hover:text-white transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    </button>
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition">
                      View Receipt
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm space-y-1 pt-2 pb-2 border-t border-b border-[#191973]">
                <p>Date: <span className="font-medium">{new Date(order.createdAt).toDateString()}</span></p>
                <p>Total: <span className="font-medium">{currency}{order.amount}</span></p>
                <p>Payment Method: <span className="font-medium">{order.paymentMethod}</span></p>
              </div>
              {activeOrderId === order._id && (
                <div className="mt-6">
                  <StatusStepper
                    statusHistory={order.statusHistory || []}
                    status={order.status}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {showReceiptModal && receiptData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeReceiptModal}>
          <div className="bg-white w-[90%] max-w-4xl max-h-[90%] overflow-auto rounded-lg shadow-lg p-6 relative" onClick={(e) => e.stopPropagation()}>
            {pdfDataUrl ? (
              <>
                {/* <iframe 
                  src={pdfDataUrl} 
                  className="w-full h-[80vh] border-none"
                  title="Receipt PDF"
                /> */}
                <div id="mobile-content" className="mobileshow">
                  <p className="text-xl text-[#101049] font-bold my-4 text-center" >Mobile viewing requires downloading the receipt.</p>
                </div>
                <div id="receipt-content" className="h-[80vh] overflow-y-auto mobilenotshow">
                  <div className="my-4 p-3 flex items-center gap-4">
                    <img
                      src={assets.logo1}
                      className="h-14 w-auto object-contain"
                      alt="Company Logo"
                    />
                    <img
                      src={assets.receiptlogo2}
                      className="h-10 w-auto object-contain"
                      alt="Company Name"
                    />
                  </div>
                  <hr className="border-[#191973] border-2" />
                  <h2 className="text-3xl font-bold my-4 text-center" style={{ fontVariant: 'small-caps' }}>Order Receipt</h2>
                  <div className="my-4 p-3 border border-[#191973]">
                    <h4 className="text-l font-bold text-center small-caps">User Details</h4>
                    <p><strong>User ID:</strong> {receiptData.user._id}</p>
                    <p><strong>User Name:</strong> {receiptData.user.name}</p>
                    <p><strong>User Email:</strong> {receiptData.user.email}</p>
                    {receiptData?.user?.phone && <p><strong>User Phone:</strong> {receiptData.user.phone}</p>}
                  </div>
                  <hr className="border-[#191973]" />
                  <div className="my-4 p-3 border border-[#191973]">
                    <h4 className="text-l font-bold text-center small-caps">Order Details</h4>
                    <p><strong>Order ID:</strong> {receiptData.order._id}</p>
                    <p><strong>Order Date:</strong> {new Date(receiptData.order.createdAt).toLocaleDateString()}</p>
                    <p><strong>Name:</strong> {receiptData.order.address.firstName} {receiptData.order.address.lastName}</p>
                    <p><strong>Email:</strong> {receiptData.order.address.email}</p>
                    <p><strong>Phone:</strong> {receiptData.order.address.phone}</p>
                    <p><strong>Address: </strong> {receiptData.order.address.street}, {receiptData.order.address.city}, {receiptData.order.address.state}, {receiptData.order.address.country}</p>
                    <p><strong>Zip–Code: </strong> {receiptData.order.address.zipcode}</p>
                    <p><strong>Payment Method : </strong> {receiptData.order.paymentMethod}</p>
                  </div>
                  <hr className="border-[#191973]" />
                  <div className="my-4 p-3 border border-[#191973]">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[#101049] text-white">
                          <th className="p-2">Sr No</th>
                          <th className="p-2">Item</th>
                          <th className="p-2">Size</th>
                          <th className="p-2">Qty</th>
                          <th className="p-2">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {receiptData.order.items.map((item, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2">{item.productId._id}<br />{item.productId.name}</td>
                            <td className="p-2">{item.size}</td>
                            <td className="p-2">{item.quantity}</td>
                            <td className="p-2">{currency}{item.price}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-[#191973] font-semibold">
                          <td className="p-2" colSpan={3}>Item Total</td>
                          <td className="p-2">
                            {
                              receiptData.order.items.reduce((acc, item) => acc + item.quantity, 0)
                            }
                          </td>
                          <td className="p-2">
                            {
                              currency +
                              receiptData.order.items.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)
                            }
                          </td>
                        </tr>
                        {receiptData.order.discountPer != '0' &&
                          <>
                            <tr className="border-t border-[#191973] font-semibold">
                              <td className="p-2" colSpan={2}>Discount Percentage </td>
                              <td className="p-2 text-green-600">
                                {receiptData.order.discountPer}%
                              </td>
                              <td className="p-2" >
                                <div className="flex items-center gap-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
                                  </svg>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                                  </svg>
                                </div>
                              </td>
                              <td className="p-2 text-green-600">
                                {receiptData.order.discountPer != '0' &&
                                  <>
                                    {currency}
                                    {
                                      ((receiptData.order.items.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)) - (receiptData.order.items.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2) * (1 - receiptData.order.discountPer / 100))).toFixed(2)
                                    }
                                  </>
                                }
                              </td>
                            </tr>
                          </>}
                        <tr className="border-t border-[#191973] font-semibold">
                          <td className="p-2" colSpan={4}>Total Amount </td>
                          <td className="p-2">
                            {currency}
                            {
                              ((receiptData.order.items.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)) - ((receiptData.order.items.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)) - (receiptData.order.items.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2) * (1 - receiptData.order.discountPer / 100)))).toFixed(2)
                            }
                          </td>
                        </tr>
                        <tr className="border-t border-[#191973] font-semibold">
                          <td className="p-2" colSpan={4}>Delivery Charge </td>
                          <td className="p-2">
                            {currency}{receiptData.order.deliveryCharge}
                          </td>
                        </tr>
                        <tr className="border-t border-[#191973] font-semibold text-lg bg-[#101049] text-white">
                          <td className="p-2 " colSpan={4}>Final Amount </td>
                          <td className="p-2">
                            {currency}{receiptData.order.amount}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={downloadReceiptPDF}
                    className="px-4 py-2 bg-[#101049] text-white rounded hover:bg-[#00bfff] hover:text-[#101049] transition"
                  >
                    Download PDF
                  </button>
                </div>
              </>
            ) : (
              <>
                <div id="receipt-content">
                  <div className="my-4 p-3 flex items-center gap-4">
                    <img
                      src={assets.logo1}
                      className="h-14 w-auto object-contain"
                      alt="Company Logo"
                    />
                    <img
                      src={assets.receiptlogo2}
                      className="h-10 w-auto object-contain"
                      alt="Company Name"
                    />
                  </div>
                  <hr className="border-[#191973] border-2" />
                  <h2 className="text-3xl font-bold my-4 text-center" style={{ fontVariant: 'small-caps' }}>Order Receipt</h2>
                  <div className="my-4 p-3 border border-[#191973]">
                    <h4 className="text-l font-bold text-center small-caps">User Details</h4>
                    <p><strong>User ID:</strong> {receiptData.user._id}</p>
                    <p><strong>User Name:</strong> {receiptData.user.name}</p>
                    <p><strong>User Email:</strong> {receiptData.user.email}</p>
                    {receiptData?.user?.phone && <p><strong>User Phone:</strong> {receiptData.user.phone}</p>}
                  </div>
                  <hr className="border-[#191973]" />
                  <div className="my-4 p-3 border border-[#191973]">
                    <h4 className="text-l font-bold text-center small-caps">Order Details</h4>
                    <p><strong>Order ID:</strong> {receiptData.order._id}</p>
                    <p><strong>Order Date:</strong> {new Date(receiptData.order.createdAt).toLocaleDateString()}</p>
                    <p><strong>Name:</strong> {receiptData.order.address.firstName} {receiptData.order.address.lastName}</p>
                    <p><strong>Email:</strong> {receiptData.order.address.email}</p>
                    <p><strong>Phone:</strong> {receiptData.order.address.phone}</p>
                    <p><strong>Address: </strong> {receiptData.order.address.street}, {receiptData.order.address.city}, {receiptData.order.address.state}, {receiptData.order.address.country}</p>
                    <p><strong>Zip–Code: </strong> {receiptData.order.address.zipcode}</p>
                    <p><strong>Payment Method : </strong> {receiptData.order.paymentMethod}</p>
                  </div>
                  <hr className="border-[#191973]" />
                  <div className="my-4 p-3 border border-[#191973]">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[#101049] text-white">
                          <th className="p-2">Sr No</th>
                          <th className="p-2">Item</th>
                          <th className="p-2">Size</th>
                          <th className="p-2">Qty</th>
                          <th className="p-2">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {receiptData.order.items.map((item, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2">{item.productId._id}<br />{item.productId.name}</td>
                            <td className="p-2">{item.size}</td>
                            <td className="p-2">{item.quantity}</td>
                            <td className="p-2">{currency}{item.price}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-[#191973] font-semibold">
                          <td className="p-2" colSpan={3}>Item Total</td>
                          <td className="p-2">
                            {
                              receiptData.order.items.reduce((acc, item) => acc + item.quantity, 0)
                            }
                          </td>
                          <td className="p-2">
                            {
                              currency +
                              receiptData.order.items.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)
                            }
                          </td>
                        </tr>
                        {receiptData.order.discountPer != '0' &&
                          <>
                            <tr className="border-t border-[#191973] font-semibold">
                              <td className="p-2" colSpan={2}>Discount Percentage </td>
                              <td className="p-2 text-green-600">
                                {receiptData.order.discountPer}%
                              </td>
                              <td className="p-2" >
                                <div className="flex items-center gap-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
                                  </svg>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                                  </svg>
                                </div>
                              </td>
                              <td className="p-2 text-green-600">
                                {receiptData.order.discountPer != '0' &&
                                  <>
                                    {currency}
                                    {
                                      ((receiptData.order.items.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)) - (receiptData.order.items.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2) * (1 - receiptData.order.discountPer / 100))).toFixed(2)
                                    }
                                  </>
                                }
                              </td>
                            </tr>
                          </>}
                        <tr className="border-t border-[#191973] font-semibold">
                          <td className="p-2" colSpan={4}>Total Amount </td>
                          <td className="p-2">
                            {currency}
                            {
                              ((receiptData.order.items.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)) - ((receiptData.order.items.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)) - (receiptData.order.items.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2) * (1 - receiptData.order.discountPer / 100)))).toFixed(2)
                            }
                          </td>
                        </tr>
                        <tr className="border-t border-[#191973] font-semibold">
                          <td className="p-2" colSpan={4}>Delivery Charge </td>
                          <td className="p-2">
                            {currency}{receiptData.order.deliveryCharge}
                          </td>
                        </tr>
                        <tr className="border-t border-[#191973] font-semibold text-lg bg-[#101049] text-white">
                          <td className="p-2 " colSpan={4}>Final Amount </td>
                          <td className="p-2">
                            {currency}{receiptData.order.amount}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </>
            )}
            <button
              onClick={closeReceiptModal}
              className="absolute top-2 right-2 text-gray-700 hover:text-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      {showReviewModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">
            <h2 className="text-2xl font-bold mb-4 text-[#101049]">Rate Your Products</h2>
            {selectedOrder.items.map((item, index) => (
              <div key={item.productId._id} className="mb-6 p-4 border border-[#191973] rounded">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={item.productId.image[0]}
                    alt={item.productId.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.productId.name}</h3>
                    <p className="text-sm text-gray-600">Size: {item.size}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Rating:</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRatings(prev => ({
                          ...prev,
                          [item.productId._id]: star
                        }))}
                        className={`text-2xl ${ratings[item.productId._id] >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Review (max 1000 chars):</label>
                  <textarea
                    value={reviews[item.productId._id] || ''}
                    onChange={(e) => setReviews(prev => ({
                      ...prev,
                      [item.productId._id]: e.target.value.slice(0, 1000)
                    }))}
                    className="w-full p-2 border rounded"
                    rows="3"
                  />
                  <div className="text-right text-sm text-gray-600">
                    {1000 - (reviews[item.productId._id]?.length || 0)} characters remaining
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 border border-[#101049] text-[#101049] rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const missingRatings = selectedOrder.items.filter(
                    item => !ratings[item.productId._id]
                  );
                  if (missingRatings.length > 0) {
                    toast.error("Please provide a rating for all products before submitting.");
                    return;
                  }
                  try {
                    const orderId = selectedOrder._id;
                    const reviewData = selectedOrder.items.map(item => ({
                      productId: item.productId._id,
                      rating: ratings[item.productId._id],
                      review: reviews[item.productId._id] || '',
                    }));
                    await axios.post(
                      `${backendUrl}/api/order/rating/${orderId}`,
                      { reviews: reviewData },
                      { headers: { token } }
                    );
                    setShowReviewModal(false);
                    setSelectedOrder(null);
                    loadOrderData();
                  } catch (error) {
                    console.error("Error submitting reviews:", error);
                  }
                }}
                className="px-4 py-2 bg-[#101049] text-white rounded hover:bg-[#00bfff] hover:text-[#101049]"
              >
                Submit Reviews
              </button>
            </div>
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-2 right-2 text-gray-700 hover:text-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default Orders;