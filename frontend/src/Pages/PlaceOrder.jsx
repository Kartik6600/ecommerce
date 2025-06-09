import React, { useContext, useState, useEffect } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { FaStripe, FaQrcode, FaMoneyBillWave } from 'react-icons/fa';
const PlaceOrder = () => {
  const [method, setMethod] = useState("");
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [paymentDone, setPaymentDone] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  })
  useEffect(() => {
    const fetchLatestOrder = async () => {
      try {
        const response = await axios.get(backendUrl + `/api/order/latestorder`, {
          headers: { token }
        });
        if (response.data.success) {
          const address = response.data.order.address;
          setFormData({
            firstName: address.firstName || '',
            lastName: address.lastName || '',
            email: address.email || '',
            street: address.street || '',
            city: address.city || '',
            state: address.state || '',
            zipcode: address.zipcode || '',
            country: address.country || '',
            phone: address.phone || ''
          });
        }
      } catch (error) {
        console.error("Failed to fetch latest order:", error);
      }
    };
    fetchLatestOrder();
  }, [backendUrl, token]);
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(data => ({ ...data, [name]: value }))
  }
  const handleScreenshotUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setScreenshotFile(file);
      setScreenshot(URL.createObjectURL(file));
      setPaymentDone(true);
    } else {
      toast.error('Please upload a valid image (jpeg/png)');
    }
  };
  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (method === 'qr') {
      setShowQR(true)
    } else {
      setShowConfirmation(true);
    }
  };
  const prepareOrderData = () => {
    let orderItems = [];
    for (const key in cartItems) {
      const item = cartItems[key];
      const itemInfo = structuredClone(item._id ? item : item.productId);
      if (itemInfo) {
        itemInfo.size = item.size;
        itemInfo.quantity = item.quantity;
        orderItems.push(itemInfo);
      }
    }
    const subtotal = getCartAmount();
    const discount = (subtotal * discountAmount) / 100;
    const totalAmount = (subtotal - discount + delivery_fee).toFixed(2);
    return { address: formData, items: orderItems, amount: totalAmount, discountPer: discountAmount, deliveryCharge: delivery_fee };
  };
  const submitFinalOrder = async () => {
    setShowConfirmation(false);
    if (method === "qr") {
      setShowQR(true);
      return;
    }
    try {
      const orderData = prepareOrderData();
      switch (method) {
        case "cod":
          const response = await axios.post(backendUrl + '/api/order/cod', orderData, { headers: { token } });
          if (response.data.success) {
            setCartItems({});
            navigate('/orders');
          } else {
            if (response.data.message === 'Not authorized Login again') {
              navigate('/login');
              toast.error("User Not Found, Kindly Login");
            } else {
              toast.error(response.data.message);
            }
          }
          break;
        case 'stripe':
          const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } });
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseStripe.data.message);
          }
          break;
        case 'qr':
          if (!paymentDone || !screenshotFile) {
            toast.warn("Please complete payment and upload screenshot.");
            return;
          }
          const formData = new FormData();
          formData.append('screenshot', screenshotFile);
          formData.append('orderData', JSON.stringify(orderData));
          const responseQR = await axios.post(
            backendUrl + '/api/order/qr',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                token
              }
            }
          );
          if (responseQR.data.success) {
            setCartItems({});
            navigate('/orders');
          } else {
            toast.error(responseQR.data.message || "QR Order failed.");
          }
          break;
        case 'gpay':
          toast.info("Razorpay / GPay integration not yet implemented.");
          break;
        default:
          toast.warn("Please select a payment method.");
          break;
      }
      setShowConfirmation(false);
    } catch (error) {
      toast.error(error.message);
      setShowConfirmation(false);
    }
  };
  const submitQROrder = async () => {
    try {
      if (!paymentDone || !screenshotFile) {
        toast.warn("Please complete payment and upload screenshot.");
        return;
      }
      const orderData = prepareOrderData();
      const formDataQR = new FormData();
      formDataQR.append("screenshot", screenshotFile);
      formDataQR.append("orderData", JSON.stringify(orderData));
      const responseQR = await axios.post(
        `${backendUrl}/api/order/qr`,
        formDataQR,
        { headers: { "Content-Type": "multipart/form-data", token } }
      );
      if (responseQR.data.success) {
        setCartItems({});
        navigate("/orders");
      } else {
        toast.error(responseQR.data.message || "QR Order failed.");
      }
      setShowQR(false);
    } catch (error) {
      toast.error(error.message);
      setShowQR(false);
    }
  };
  const onSubmitCoupon = async (event) => {
    try {
      const response = await axios.get(`${backendUrl}/api/coupon/apply/${couponCode}`, {
        headers: { token }
      });
      if (response.data.success && response.data.coupon) {
        const { discount, code } = response.data.coupon;
        setDiscountAmount(discount);
        toast.success(`Coupon ${code} applied! ${discount}% discount activated.`);
      } else {
        toast.error(response?.data?.message);
        setDiscountAmount(0);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      setDiscountAmount(0);
    }
  };
  const upiId = 'kp04064966-1@okicici';
  const upiName = 'Great Stack';
  const subtotal = getCartAmount();
  const discount = (subtotal * discountAmount) / 100;
  const totalAmount = (subtotal - discount + delivery_fee).toFixed(2);
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${totalAmount}&cu=INR`;
  return (
    <>
      <form onSubmit={handleOrderSubmit} className='flex flex-col sm:flex-row justify-between gap-4 py-10 sm:pt-14 min-h-[80vh]'>
        <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
          <div className='text-xl sm:text-2xl my-3'>
            <Title text1={'DELIVERY'} text2={'INFORMATION'} />
          </div>
          <div className='flex gap-3 '>
            <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='bg-zinc-100 border-2 border-[#FBCFE8] text-[#101049] rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
            <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='bg-zinc-100 border-2 border-[#FBCFE8] text-[#101049] rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
          </div>
          <input required onChange={onChangeHandler} name='email' value={formData.email} className='bg-zinc-100 border-2 border-[#FBCFE8] text-[#101049] rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
          <input required onChange={onChangeHandler} name='street' value={formData.street} className='bg-zinc-100 border-2 border-[#FBCFE8] text-[#101049] rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
          <div className='flex gap-3'>
            <input required onChange={onChangeHandler} name='city' value={formData.city} className='bg-zinc-100 border-2 border-[#FBCFE8] text-[#101049] rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
            <input required onChange={onChangeHandler} name='state' value={formData.state} className='bg-zinc-100 border-2 border-[#FBCFE8] text-[#101049] rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
          </div>
          <div className='flex gap-3'>
            <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='bg-zinc-100 border-2 border-[#FBCFE8] text-[#101049] rounded py-1.5 px-3.5 w-full' type="text" placeholder='Zip code' />
            <input required onChange={onChangeHandler} name='country' value={formData.country} className='bg-zinc-100 border border-2 border-[#FBCFE8] text-[#101049] rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
          </div>
          <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='bg-zinc-100 border border-2 border-[#FBCFE8] text-[#101049] rounded py-1.5 px-3.5 w-full' type="text" placeholder='Phone number' />
        </div>
        <div className='mt-2'>
          <div className='mt-2 w-full sm:w-[450px]'>
            <CartTotal discountAmount={discountAmount} />
          </div>
          <div className="mt-12">
            <Title text1="DISCOUNT" text2="COUPON" />
            <div className="bg-zinc-100 w-full flex flex-col sm:flex-row items-stretch gap-2 border-2 border-[#FBCFE8] rounded-md">
              <input
                onChange={(e) => {
                  let value = e.target.value.toUpperCase();
                  const filteredValue = value.replace(/[^A-Z0-9@#]/g, '');
                  setCouponCode(filteredValue);
                }}
                value={couponCode}
                className="bg-zinc-100 flex-1 outline-none text-[#101049] px-3 py-2"
                type="text"
                placeholder="Enter coupon code"
              />
              <button
                className="bg-sky-300 text-[#101049] border-2 border-[#FBCFE8] rounded-md text-sm px-8 py-4 font-semibold active:bg-[#101049] active:text-white hover:bg-pink-200"
                type="button"
                onClick={onSubmitCoupon}
              >
                Apply
              </button>
            </div>
          </div>
          <div className='mt-12'>
            <Title text1={'PAYMENT'} text2={'METHOD'} />
            <div className='flex gap-3 flex-col lg:flex-row'>
              <div onClick={() => setMethod('stripe')} className='bg-zinc-100 flex items-center gap-3 border-2 border-[#FBCFE8] rounded-md p-2 px-3 cursor-pointer'>
                <p className={`mt-1.5 min-w-3.5 h-3.5 border border-[#191973] rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
                <FaStripe className='text-2xl text-[#101049] w-10 h-10' />
                <p className='text-[#101049] text-md font-bold'>Pay</p>
              </div>
              <div onClick={() => setMethod('qr')} className='bg-zinc-100 flex items-center gap-3 border-2 border-[#FBCFE8] rounded-md p-2 px-3 cursor-pointer'>
                <p className={`mt-1.5 min-w-3.5 h-3.5 border border-[#191973] rounded-full ${method === 'qr' ? 'bg-green-400' : ''}`}></p>
                <FaQrcode className='text-2xl text-[#101049] w-10 h-10' />
                <p className='text-[#101049] text-md font-bold'>QR</p>
              </div>
              <div className='relative group'>
                <div onClick={() => setMethod('cod')} className='bg-zinc-100 flex items-center gap-3 border-2 border-[#FBCFE8] rounded-md p-2 px-3 cursor-pointer'>
                  <p className={`mt-1.5 min-w-3.5 h-3.5 border border-[#191973] rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                  <FaMoneyBillWave className='text-2xl text-[#101049] w-10 h-10' />
                  <p className='text-[#101049] text-md font-bold'>COD</p>
                </div>
                <div className='absolute top-full mt-1 left-1/2 -translate-x-1/2 w-max px-3 py-1 bg-[#101049] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'>
                  Cash On Delivery
                </div>
              </div>
            </div>
            <div className='w-full text-end mt-8'>
              <button type='submit' className='bg-[#FBCFE8] text-[#101049] border border-[#FBCFE8] rounded-md px-16 py-3 text-sm font-semibold active:bg-[#101049] active:text-[#ffffff] hover:bg-[#F472B6]'>PLACE ORDER</button>
            </div>
          </div>
        </div>
      </form >
      {showConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-zinc-100 rounded-xl p-8 w-[90%] max-w-md shadow-lg border-2 border-[#FBCFE8]">
            <h2 className="text-lg font-semibold text-[#101049] mb-4">Confirm Your Order</h2>
            <p className="mb-2">Payment Method: <strong>{method.toUpperCase()}</strong></p>
            {(() => {
              const totalAmount = getCartAmount() - (getCartAmount() * discountAmount) / 100 + delivery_fee;
              const isStripeAndTooLow = method === 'stripe' && totalAmount < 50;
              return (
                <>
                  <p className="mb-4">Total Amount: <strong>₹{totalAmount.toFixed(2)}</strong></p>
                  {isStripeAndTooLow && (
                    <p className="text-red-600 text-sm mb-4">Minimum order amount for Stripe payment is ₹50.</p>
                  )}
                  <div className="flex justify-end space-x-4">
                    <button
                      className="px-4 py-2 rounded bg-gray-300 text-[#101049] hover:bg-gray-400"
                      onClick={() => setShowConfirmation(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className={`px-4 py-2 rounded font-semibold text-[#101049] ${isStripeAndTooLow ? 'bg-gray-300 cursor-not-allowed' : 'bg-sky-300 hover:bg-pink-200'
                        }`}
                      onClick={submitFinalOrder}
                      disabled={isStripeAndTooLow}
                    >
                      Proceed
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
      {showQR && method === "qr" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className=" bg-zinc-100 p-6 rounded-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-bold mb-2 text-[#101049]">Scan QR & Pay</h2>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`} alt="QR Code" className="mx-auto" />
            <p className="mb-2">Payment Method: <strong>{method.toUpperCase()}</strong></p>
            <p className="mb-4">Total Amount: <strong>₹{totalAmount}</strong></p>
            <p className="mb-4">Payment Screenshot :</p>
            <input type="file" accept="image/*" onChange={handleScreenshotUpload} className="mt-4" />
            {screenshot && <img src={screenshot} alt="Payment Proof" className="mt-3 w-32 mx-auto rounded border" />}
            <div className="flex justify-end space-x-4 mt-5">
              <button className="px-4 py-2 rounded bg-gray-300 text-[#101049] hover:bg-gray-400" onClick={() => setShowQR(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 rounded bg-sky-300 text-[#101049] font-semibold hover:bg-pink-200" onClick={submitQROrder}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default PlaceOrder