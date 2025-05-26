import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import axios from "axios";
import {
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaCheckCircle,
  FaMoneyBillWave,
  FaUndoAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, addToWishList, token, backendUrl } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [selectedRating, setSelectedRating] = useState("All");
  const fetchProductData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/${productId}`);
      const data = res.data.product;
      setProductData(data);
      setImage(data.image[0]);
    } catch (err) {
      console.error("Failed to fetch product data:", err);
    }
  };
  const getAverageRating = () => {
    if (!productData?.analysis || productData.analysis.length === 0) return 5;
    const total = productData.analysis.reduce((acc, curr) => acc + curr.rating, 0);
    return total / productData.analysis.length;
  };
  const averageRating = getAverageRating();
  const filledStars = Math.floor(averageRating);
  const halfStar = averageRating - filledStars >= 0.5;
  const emptyStars = 5 - filledStars - (halfStar ? 1 : 0);
  const filteredReviews =
    selectedRating === "All"
      ? productData?.analysis || []
      : productData?.analysis?.filter((review) => review.rating === selectedRating) || [];
  useEffect(() => {
    fetchProductData();
  }, [productId]);
  if (!productData) return <div className="text-center py-20 text-[#101049]">Loading product...</div>;
  return (
    <motion.div
      className="border-t border-[#191973] py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex gap-12 flex-col sm:flex-row">
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-start sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <motion.img
                whileHover={{ scale: 1.05 }}
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border rounded-md transition duration-300 ${image === item ? "border-[#00bfff]" : "border-[#191973]"}`}
                alt=""
              />
            ))}
          </div>
          <motion.div
            className="w-full sm:w-[80%]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img className="w-full h-auto border border-[#191973] rounded-md" src={image} alt="" />
          </motion.div>
        </div>
        <motion.div
          className="flex-1 bg-zinc-100 border border-[#191973] rounded-md p-2"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-medium text-2xl mt-2 text-[#101049]">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2 text-[#ffc107]">
            {[...Array(filledStars)].map((_, index) => <FaStar key={index} />)}
            {halfStar && <FaStarHalfAlt />}
            {[...Array(emptyStars)].map((_, index) => <FaRegStar key={index} />)}
            <p className="pl-2 text-[#101049]">({productData.analysis?.length || 1})</p>
          </div>
          <p className="mt-5 text-3xl font-medium text-[#101049]">{currency}{productData.price}</p>
          <p className="mt-5 w-4/5 text-[#101049]">{productData.description}</p>
          <div className="flex flex-col gap-4 my-8 text-[#101049]">
            <p>Select Size</p>
            <div className="flex gap-2 font-semibold">
              {productData.sizes.map((item, index) => (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  key={index}
                  onClick={() => setSize(item)}
                  className={`border rounded-md py-2 px-4 transition ${item === size ? "bg-pink-200 border-[#ff69b4]" : "bg-[#ccf2ff] border-[#191973] hover:bg-blue-100"}`}
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </div>
          {token ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addToCart(productData._id, size)}
                className="w-1/2 bg-sky-300 text-[#101049] px-8 py-3 text-sm border border-[#191973] rounded-md font-semibold hover:bg-pink-200 transition"
              >
                ADD TO CART
              </motion.button>
              <br /><br />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addToWishList(productData._id)}
                className="w-1/2 bg-rose-200 text-[#101049] px-8 py-3 text-sm border border-[#191973] rounded-md font-semibold hover:bg-rose-400 transition"
              >
                ADD TO WISHLIST
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = "/login"}
              className="w-1/2 bg-sky-300 text-[#101049] px-8 py-3 text-sm border border-[#191973] rounded-md font-semibold hover:bg-pink-200 transition"
            >
              LOGIN TO CONTINUE
            </motion.button>
          )}
          <hr className="mt-8 sm:w-4/5 border border-[#191973]" />
          <div className='text-sm text-[#101049] mt-5 flex flex-col gap-2'>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-600" />
              <span>100% Original product.</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMoneyBillWave className="text-green-600" />
              <span>Cash on delivery available.</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUndoAlt className="text-green-600" />
              <span>Easy returns within 7 days.</span>
            </div>
          </div>
        </motion.div>
      </div>
      <motion.div
        className="mt-20 rounded-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex">
          <p className="border px-5 py-3 text-sm text-[#101049] border-[#191973] rounded-md font-semibold bg-zinc-100">
            Description
          </p>
        </div>
        <div className="flex flex-col gap-4 border border-[#191973] rounded-md px-6 py-6 text-sm text-[#101049] bg-zinc-100">
          <p>{productData.name}</p>
          <p>{productData.description}</p>
          <p>Just {currency}{productData.price}</p>
          <p>Available Sizes: {productData.sizes.map((item, index) => (<span key={index}> {item} |</span>))}</p>
        </div>
      </motion.div>
      <motion.div
        className="mt-20 rounded-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex">
          <p className="border px-5 py-3 text-sm text-[#101049] border-[#191973] rounded-md font-semibold bg-zinc-100">
            Reviews
          </p>
        </div>
        <div className="flex gap-2 mt-4 mb-6 flex-wrap">
          {["All", 5, 4, 3, 2, 1].map((star) => (
            <motion.button
              key={star}
              onClick={() => setSelectedRating(star)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-1 px-3 py-1 text-sm rounded-full border ${
                selectedRating === star
                  ? "bg-pink-00 border-[#191973] text-[#101049]"
                  : "bg-zinc-100 border-[#191973] text-[#101049]"
              }`}
            >
              {[...Array(typeof star === "number" ? star : 0)].map((_, i) => (
                <FaStar key={i} className="text-yellow-500" />
              ))}
              {star === "All" && <span>All</span>}
            </motion.button>
          ))}
        </div>
        <div className="flex flex-col gap-4 border border-[#191973] rounded-md px-6 py-6 text-sm text-[#101049] bg-zinc-100">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((item, index) => (
              <motion.div
                key={index}
                className="mb-6 border-b pb-4 border-[#191973]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#191973] text-white text-xs w-6 h-6 flex items-center justify-center rounded-full font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex gap-0.5 text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>{item.rating >= star ? <FaStar /> : <FaRegStar />}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Rated {item.rating}/5</p>
                </div>
                {item?.review && (
                  <p className="italic text-[#101049] bg-sky-200 p-3 rounded-md text-sm leading-relaxed">
                    {item.review}
                  </p>
                )}
              </motion.div>
            ))
          ) : (
            <p className="italic text-[#101049]">No reviews with this rating.</p>
          )}
        </div>
      </motion.div>
      <div>
        <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
      </div>
    </motion.div>
  );
};
export default Product;
