import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
const Wishlist = () => {
  const { wishlistItems, updateWishlist } = useContext(ShopContext);
  return (
    <div className='border-t border-[#191973] py-10'>
      <div className='text-2xl mb-3'>
        <Title text1={'Your'} text2={'WISHLIST'} />
      </div>
      <div>
        {wishlistItems.map((item, index) => (
          <>
            <div key={index} className='bg-zinc-100 py-4 border-t border-b border-[#191973] text-[#101049] grid grid-cols-[4fr_0.5fr] sm:grid-cols-[4fr_0.5fr] items-center gap-4'>
              <Link className='cursor-pointer' to={`/product/${item?.productId?._id}`}>
                <div className='flex items-start gap-6'>
                  <img className='w-20 sm:w-20 border border-[#191973] rounded-md' src={item?.productId?.image[0]} alt="" />
                  <div>
                    <p className='text-xs sm:text-lg font-medium text-[#101049]'>{item?.productId?.name}</p>
                    <p className='text-xs sm:text-lg font-medium text-[#101049]'>Category : {item?.productId?.category} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Sub Category : {item?.productId?.subCategory}</p>
                    <p className='text-xs sm:text-lg font-medium text-[#101049]'>Sub Category : {item?.productId?.subCategory}</p>
                    <p className='text-xs sm:text-lg font-medium text-[#101049]'>Available Sizes : {item?.productId?.sizes?.join('   ')}</p>
                  </div>
                </div>
              </Link>
              <FaTrash
                onClick={() => updateWishlist(item?.productId?._id)}
                className="text-red-600 text-lg mr-4 mt-9 sm:text-xl cursor-pointer"
              />
            </div>
          </>
        ))}
      </div>
      {wishlistItems.length === 0 && (
        <div className="text-center mt-10 text-[#101049]">
          ☹️ Your wishlist is empty.
        </div>
      )}
    </div>
  );
};
export default Wishlist;