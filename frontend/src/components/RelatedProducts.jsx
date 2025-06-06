import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import { useEffect } from "react";
import Title from "./Title";
import Products from "../components/Products";
import { motion } from "framer-motion";
const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);
  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter((item) => category === item.category);
      productsCopy = productsCopy.filter(
        (item) => subCategory === item.subCategory
      );
      setRelated(productsCopy.slice(0, 5));
    }
  }, [products]);
  return (
    <div className="py-5">
      <div className="text-center text-3xl py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item, index) => (
          // <Products className="border border-[#00bfff]" key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
          <motion.div
            className="border border-[#00bfff] rounded-md"
            key={item._id || index}
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
    </div>
  );
};
export default RelatedProducts;
