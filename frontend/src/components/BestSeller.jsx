import { ShopContext } from "../context/ShopContext.jsx";
import React, { useContext, useState, useEffect } from "react";
import Title from "./Title";
import Products from "../components/Products";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSellers, setBestSellers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const filtered = products.filter((item) => item?.bestseller === true);
      setBestSellers(filtered.slice(0, visibleCount));
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [products, visibleCount]);
  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      const filtered = products.filter((item) => item?.bestseller === true);
      const newCount = visibleCount + 5;
      setBestSellers(filtered.slice(0, newCount));
      setVisibleCount(newCount);
      setLoadingMore(false);
    }, 500);
  };
  const totalBestSellers = products.filter((item) => item?.bestseller === true).length;
  return (
    <div>
      <div className="text-center py-8 text-3xl">
        <Title text1={"BEST"} text2={"SELLER"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-orange-400">
          Discover what everyone’s loving – our Bestsellers are tried, true, and trending.
        </p>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <FaSpinner className="animate-spin text-2xl text-[#00bfff]" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {bestSellers.map((item, index) => (
              <motion.div
                className="border border-[#00bfff] rounded-md"
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Products
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                  views={item.viewCount}
                />
              </motion.div>
            ))}
          </div>
          {visibleCount < totalBestSellers && (
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="flex items-center gap-2 px-4 py-2 bg-[#FBCFE8] text-[#101049] rounded-xl hover:bg-[#F472B6] transition disabled:opacity-70"
              >
                {loadingMore && <FaSpinner className="animate-spin text-sm" />}
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default BestSeller;
