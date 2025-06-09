import React, { useContext } from "react"
import { ShopContext } from "../context/ShopContext.jsx"
import Title from "./Title"
const CartTotal = ({ discountAmount = 0,trigger }) => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
  const subtotal = getCartAmount();
  const discount = (subtotal * discountAmount) / 100;
  const total = subtotal + delivery_fee - discount;
  return (
    <div className='w-full '>
      <div className='text-2xl'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>
      <div className='bg-zinc-100 flex flex-col gap-2 mt-2 text-sm border-2 border-[#FBCFE8] rounded-md pl-2 pr-2 pt-2 pb-2'>
        <div className='flex justify-between text-[#191973]'>
          <p>SubTotal</p>
          <p>{currency} {subtotal.toFixed(2)}</p>
        </div>
        <hr className="border border-[#191973]" />
        {discountAmount > 0 && (
          <>
            <div className='flex justify-between text-[#00bfff]'>
              <p>Discount ({discountAmount}%)</p>
              <p>-{currency} {discount.toFixed(2)}</p>
            </div>
            <hr className="border border-[#191973]" />
          </>
        )}
        <div className='flex justify-between text-[#101049]'>
          <p>Shipping Fee</p>
          <p>{currency} {delivery_fee.toFixed(2)}</p>
        </div>
        <hr className="border border-[#191973]" />
        <div className='flex justify-between text-[#101049]'>
          <b>Total</b>
          <b>{currency} {subtotal === 0 ? 0 : total.toFixed(2)}</b>
        </div>
      </div>
    </div>
  );
};
export default CartTotal