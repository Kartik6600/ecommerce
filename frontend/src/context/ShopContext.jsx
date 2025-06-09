import React, { createContext, useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import axios from "axios"
export const ShopContext = createContext();
const ShopContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = "₹";
  const delivery_fee = 10;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState();
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const addToCart = async (itemId, size) => {
    if (!size) return toast.error('Select size');
    if (token) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId, size },
          { headers: { token } }
        );
        fetchDataCart();
        toast.success(response.data?.message || 'Added to cart', { autoClose: 1000 });
      } catch (error) {
        toast.error(error.response?.data?.message || error.message || 'Failed to add to cart', { autoClose: 1000 });
      }
    }
  };
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
        }
      }
    }
    return totalCount
  }
  const updateQuantity = async (itemId, size, newQuantity) => {
    if (token) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId, size, quantity: newQuantity },
          { headers: { token } }
        );
        toast.success(response.data.message);
        fetchDataCart();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update quantity");
      }
    }
  };
  const getCartAmount = () => {
    let totalAmount = 0;
    if (!Array.isArray(cartItems)) return totalAmount;
    cartItems.forEach(item => {
      const product = item.productId;
      if (product && item.quantity > 0) {
        totalAmount += product.price * item.quantity;
      }
    });
    return totalAmount;
  };
  const addToWishList = async (itemId) => {
    if (token) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/wishlist/add`,
          { itemId },
          { headers: { token } }
        );
        fetchDataWishlist();
        toast.success(response.data?.message || 'Added to wishlist', { autoClose: 1000 });
      } catch (error) {
        toast.error(error.response?.data?.message || error.message || 'Failed to add to wishlist', { autoClose: 1000 });
      }
    }
  };
  const getWishCount = () => wishlistItems.length;
  const updateWishlist = async (itemId) => {
    if (token) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/wishlist/update`,
          { itemId },
          { headers: { token } }
        );
        toast.success(response.data.message || 'Wishlist updated', { autoClose: 1000 });
        fetchDataWishlist();
      } catch (error) {
        toast.error(error.response?.data?.message || error.message || 'Failed to update wishlist', { autoClose: 1000 });
      }
    }
  };
  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setProducts(response.data.products)
      } else {
        toast.error(response.data.message, { autoClose: 1000 })
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  const getUserCart = async (token) => {
    try {
      const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })
      if (response.data.success) {
        setCartItems(response.data.cartData, { autoClose: 1000 })
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  useEffect(() => {
    getProductsData()
  }, [])
  useEffect(() => {
    if (!token && localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'))
      getUserCart(localStorage.getItem('token'))
    }
  }, [])
  const fetchDataWishlist = async () => {
    try {
      const wishRes = await axios.post(`${backendUrl}/api/wishlist/get`, {}, { headers: { token } });
      setWishlistItems(wishRes.data.wishlist, { autoClose: 1000 });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to fetch wishlist data", { autoClose: 1000 });
    }
  };
  const fetchDataCart = async () => {
    try {
      const cartRes = await axios.post(`${backendUrl}/api/cart/get`, {}, { headers: { token } });
      setCartItems(cartRes.data.cartData);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to fetch cart data");
    }
  };
  const fetchData = async () => {
    try {
      fetchDataWishlist();
      fetchDataCart();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to fetch data");
    }
  };
  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);
  const value = {
    products, currency, delivery_fee,
    search, setSearch, showSearch, setShowSearch,
    cartItems, addToCart, getCartCount, setCartItems,
    updateQuantity, getCartAmount, navigate,
    backendUrl, token, setToken, getUserCart, getWishCount,
    wishlistItems, setWishlistItems, addToWishList, updateWishlist
  }
  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  )
}
export default ShopContextProvider