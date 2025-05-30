import { useContext, useEffect, useState } from "react"
import { ShopContext } from "../context/ShopContext.jsx"
import Title from "../components/Title"
import { assets } from "../assets/assets"
import { FaTrash } from "react-icons/fa";
import CartTotal from "../components/CartTotal"
import { Link } from "react-router-dom";
const Cart = () => {
  const { currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  useEffect(() => {
    const tempData = [];
    for (const productId in cartItems) {
      const item = cartItems[productId];
      if (item.quantity > 0) {
        tempData.push({
          _id: item.productId._id,
          size: item.size,
          quantity: item.quantity,
          productData: item.productId,
        });
      }
    }
    setCartData(tempData);
  }, [cartItems]);
  const [forceUpdate, setForceUpdate] = useState(false);
  return (
    <div className='border-t border-[#191973] py-10'>
      <div className='text-2xl mb-3'>
        <Title text1={'Your'} text2={'CART'} />
      </div>
      <div>
        {
          cartData.map((item, index) => {
            const productData = item?.productData;
            return (
              <>
                <div key={index} className='bg-zinc-100 py-4 border-t border-b border-[#191973] text-[#101049] grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] item-center gap-4'>
                  <div className='flex items-start gap-6'>
                    <Link className='cursor-pointer' to={`/product/${productData?._id}`}>
                      <img className='w-16 sm:w-20 border border-[#191973] rounded-md' src={productData?.image[0]} alt="" />
                    </Link>
                    <div>
                      <Link className='cursor-pointer' to={`/product/${productData?._id}`}>
                        <p className='text-xs sm:text-lg font-medium text-[#101049]'>{productData?.name}</p>
                      </Link>
                      <div className='flex items-center gap-5 mt-2 text-[#101049]'>
                        <p>{currency}{productData?.price}</p>
                        <p className='px-2 sm:px-3 sm:py-1 border bg-[#ccf2ff] text-[#101049] border border-[#191973] rounded-md'>{item?.size}</p>
                      </div>
                    </div>
                  </div>
                  <input
                    onChange={(e) =>
                      e.target.value === '' || e.target.value === '0'
                        ? null
                        : updateQuantity(productData?._id, item.size, Number(e.target.value))
                    }
                    className="border border-[#191973] rounded-md max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 h-1/2 mt-7 text-[#101049]"
                    type="number"
                    min={1}
                    defaultValue={item?.quantity}
                  />
                  <FaTrash
                    onClick={() => updateQuantity(productData?._id, item?.size, 0)}
                    className="text-[#101049] mt-9 cursor-pointer hover:text-red-600 mr-4 w-4 sm:w-5 h-auto"
                  />
                </div>
              </>
            );
          })
        }
        {
          cartData.length === 0 && (
            <div className="text-center mt-10 text-[#101049] py-44">
              ☹️ No Items in Cart.
            </div>
          )
        }
      </div>
      {
        cartData.length !== 0 && (
          <div className='flex justify-end my-20'>
            <div className='w-full sm:w-[450px]'>
              <CartTotal />
              <div className='w-full text-end'>
                <button onClick={() => navigate('/place-order')} className='bg-sky-300 text-[#101049] border border-[#191973] rounded-md text-sm my-8 px-8 py-3 font-semibold active:bg-[#101049] active:text-[#ffffff] hover:bg-pink-200'>PROCEED TO CHECKOUT</button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}
export default Cart