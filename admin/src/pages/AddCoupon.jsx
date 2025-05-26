import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { useLocation } from 'react-router-dom'
import { routesConfig } from '../RoutesConfig'
const AddCoupon = ({ token }) => {
  const location = useLocation()
  const currentRoute = routesConfig.find(route => route.path === location.pathname)
  const title = currentRoute?.label || 'Page'
  const Icon = currentRoute?.icon || null
  const today = new Date().toISOString().split('T')[0];
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [discount, setDiscount] = useState('')
  const [start, setStart] = useState(today)
  const [expiry, setExpiry] = useState('')
  const [isActive, setIsActive] = useState(false)
  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      const body = {
        name,
        code,
        discount,
        start,
        expiry,
      }
      const response = await axios.post(backendUrl + '/api/coupon/create', body, { headers: { token, 'Content-Type': 'application/json', } })
      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setCode('')
        setDiscount('')
        setStart('')
        setExpiry('')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <div className="px-4 md:p-8 py-4 space-y-10 bg-gradient-to-br from-gray-50 to-white min-h-screen mt-10 sm:mt-0">
      <h1 className="text-4xl font-extrabold text-[#191973] mb-2 flex items-center gap-2 border-b pb-2">
        {Icon && <span className="text-pink-500">{Icon}</span>}
        {title}
      </h1>
      <div className="flex flex-col items-center">
        <form onSubmit={onSubmitHandler} className="grid w-full max-w-3xl grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <p className="mb-2 text-[#101049]">Coupon Name</p>
            <input onChange={(e) => setName(e.target.value)} value={name} className="w-full px-3 py-2 border border-[#191973] rounded-md text-[#101049] bg-white" type="text" placeholder="Type here" required />
          </div>
          <div className="col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-[#101049]">Coupon Code</p>
              </div>
              <p className="text-[#FF0000] text-xs">(Only Contain A-Z , 0-9, @ , #)</p>
            </div>
            <input
              onChange={(e) => {
                let value = e.target.value.toUpperCase();
                if (/^[A-Z0-9@#]*$/.test(value)) setCode(value);
              }}
              value={code}
              className="w-full px-3 py-2 border border-[#191973] rounded-md text-[#101049] bg-white"
              type="text"
              placeholder="Type here"
              required
            />
          </div>
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-[#101049]">Discount %</p>
              <p className="text-[#FF0000] text-xs">(0 – 100)</p>
            </div>
            <input
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,3}$/.test(value)) {
                  const numericValue = Number(value);
                  if (value === '' || (numericValue >= 0 && numericValue <= 100)) setDiscount(value);
                }
              }}
              value={discount}
              className="w-full px-3 py-2 border border-[#191973] rounded-md text-[#101049] bg-white"
              type="text"
              placeholder="25"
              required
            />
          </div>
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-[#101049]">Start Date</p>
            </div>
            <input
              onChange={(e) => setStart(e.target.value)}
              value={start}
              className="w-full px-3 py-2 border border-[#191973] rounded-md text-[#101049] bg-white"
              type="date"
              min={today}
              required
            />
          </div>
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-[#101049]">Expiry Date</p>
            </div>
            <input
              onChange={(e) => setExpiry(e.target.value)}
              value={expiry}
              className="w-full px-3 py-2 border border-[#191973] rounded-md text-[#101049] bg-white"
              type="date"
              min={start}
              required
            />
          </div>
          <div className="col-span-full flex justify-start">
            <button type="submit" className="w-full md:w-40 py-3 mt-4 bg-pink-100 text-[#101049] border border-[#191973] rounded-md font-semibold active:bg-pink-500 active:text-white hover:bg-pink-200">
              Add Coupon
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default AddCoupon
