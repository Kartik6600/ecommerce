import React from "react"
import { MdSwapHoriz, MdOutlineReplay, MdSupportAgent } from "react-icons/md"
const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around space-x-0 sm:space-x-2 p-12 text-center text-xs sm:text-sm md:text-base text-gray-700'>
      <div>
        <MdSwapHoriz className='text-4xl text-[#FBCFE8] m-auto mb-3 mt-3' />
        <p className='text-[#00bfff] font-semibold'>Easy Exchange Policy</p>
        <p className='text-orange-400'>We offer hassle free exchange policy</p>
      </div>
      <div>
        <MdOutlineReplay className='text-4xl text-[#FBCFE8] m-auto mb-3 mt-3' />
        <p className='text-[#00bfff] font-semibold'>7 Days Return Policy</p>
        <p className='text-orange-400'>We offer 7 days free return policy</p>
      </div>
      <div>
        <MdSupportAgent className='text-4xl text-[#FBCFE8] m-auto mb-3 mt-3' />
        <p className='text-[#00bfff] font-semibold'>Best Customer Support</p>
        <p className='text-orange-400'>We provide 24x7 customer support</p>
      </div>
    </div>
  )
}
export default OurPolicy
