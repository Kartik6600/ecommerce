import React from "react"
const NewsLetterBox = () => {
    const onSubmitHandler = () => {
        event.preventDefault();
    }
  return (
    <div className='text-center'>
      <p className='text-2xl font-medium text-[#191973]'>Subscribe now & get 20% off</p>
      <p className='text-[#101049] mt-3'>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the.
      </p>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex display-flex-center space-x-2 mx-auto my-6 border-2 border-[#191973] rounded-md pl-3'>
        <input className='w-1/1 sm:flex-1 outline-none bg-white text-[#101049]' type="email" placeholder="Enter your email" required />
        <button className='bg-[#00bfff] text-[#101049] border border-[#191973] rounded-md text-sm px-12 py-4 font-semibold active:bg-[#101049] active:text-[#ffffff]' type='submit' >SUBSCRIBE</button>
      </form>
    </div>
  )
}
export default NewsLetterBox
