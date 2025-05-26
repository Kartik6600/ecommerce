import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import { Link } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";
const Products = ({ id, image, name, price, views }) => {
  const { currency, addToWishList } = useContext(ShopContext);
  return (
    <div className="border border-[#191973] h-full rounded-md text-[#101049] cursor-pointer bg-zinc-100">
      <Link to={`/product/${id}`}>
        <div className="overflow-hidden">
          <img
            className="hover:scale-110 transition ease-in-out h-50"
            src={image[0]}
            alt=""
          />
        </div>
        <p className="pt-2 pb-1 pl-1 text-sm">{name}</p>
      </Link>
      <div className="flex items-center justify-between w-full px-1 pb-2">
        <p className="text-sm font-medium">
          {currency}{price}
        </p>
        {views !== 0 && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            <span>{views}</span>
          </div>
        )}
        <AiOutlineHeart
          className="w-6 h-6 cursor-pointer text-[#101049]"
          onClick={() => addToWishList(id)}
          title="Add to wishlist"
        />
      </div>
    </div>
  );
};
export default Products;
