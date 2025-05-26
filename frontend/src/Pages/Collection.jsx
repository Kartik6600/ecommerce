import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import Title from "../components/Title";
import Products from "../components/Products";
import { motion } from "framer-motion";
import {
  FaChevronRight,
  FaSort,
  FaSortAmountDown,
  FaSortAmountUpAlt,
  FaRegCheckCircle,
  FaTimes,
} from "react-icons/fa";
const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [size, setSize] = useState([]);
  const [sortType, setSortType] = useState("relavent");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  useEffect(() => {
    const categories = [
      ...new Set(products.map((item) => item.category).filter(Boolean)),
    ];
    const subCategories = [
      ...new Set(products.map((item) => item.subCategory).filter(Boolean)),
    ];
    const sizes = [
      ...new Set(
        products
          .flatMap((item) => item.sizes || [])
          .filter(Boolean)
      ),
    ];
    setCategoryOptions(categories);
    setSubCategoryOptions(subCategories);
    setSizeOptions(sizes);
  }, [products]);
  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };
  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };
  const toggleSize = (e) => {
    const value = e.target.value;
    setSize((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };
  const applyFilter = () => {
    let productsCopy = products.slice();
    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }
    if (size.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        item.sizes?.some((s) => size.includes(s))
      );
    }
    setFilterProducts(productsCopy);
  };
  const sortProduct = () => {
    let fpCopy = filterProducts.slice();
    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };
  useEffect(() => {
    applyFilter();
  }, [category, subCategory, size, search, showSearch, products]);
  useEffect(() => {
    sortProduct();
  }, [sortType]);
  return (
    <div className="flex flex-col sm:flex-row py-10 border-t border-[#191973] h-[calc(100vh-80px)]">
      <div
        className={`fixed top-0 left-0 sm:static bg-zinc-200 z-20 sm:z-auto sm:bg-transparent h-full sm:h-auto w-3/4 sm:w-auto overflow-y-auto sm:overflow-visible transition-transform duration-300 ease-in-out ${
          showFilter ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        }`}
      >
        <div className="min-w-60 pr-4 p-4 sm:p-0 sm:pr-4">
          <div className="flex justify-end sm:hidden mb-4">
            <button
              onClick={() => setShowFilter(false)}
              className="text-[#191973] text-xl"
            >
              <FaTimes />
            </button>
          </div>
          <p className="my-2 text-xl flex items-center gap-2 text-[#191973]">
            FILTERS
          </p>
          <div className="bg-zinc-100 border-2 border-[#191973] rounded-md pl-5 py-3 mt-6">
            <p className="mb-3 text-sm font-medium text-[#191973]">CATEGORIES</p>
            <div className="flex flex-col gap-2 text-sm font-light text-[#101049]" onClick={() => setShowFilter(false)}>
              {categoryOptions.map((cat) => (
                <label key={cat} className="flex gap-2">
                  <input
                    className="w-3"
                    type="checkbox"
                    value={cat}
                    onChange={toggleCategory}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>
          <div className="bg-zinc-100 border-2 border-[#191973] rounded-md pl-5 py-3 my-5">
            <p className="mb-3 text-sm font-medium text-[#191973]">TYPE</p>
            <div className="flex flex-col gap-2 text-sm font-light text-[#101049]" onClick={() => setShowFilter(false)}>
              {subCategoryOptions.map((type) => (
                <label key={type} className="flex gap-2">
                  <input
                    className="w-3"
                    type="checkbox"
                    value={type}
                    onChange={toggleSubCategory}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
          <div className="bg-zinc-100 border-2 border-[#191973] rounded-md pl-5 py-3 my-5">
            <p className="mb-3 text-sm font-medium text-[#191973]">SIZE</p>
            <div className="flex flex-col gap-2 text-sm font-light text-[#101049]" onClick={() => setShowFilter(false)}>
              {sizeOptions.map((s) => (
                <label key={s} className="flex gap-2">
                  <input
                    className="w-3"
                    type="checkbox"
                    value={s}
                    onChange={toggleSize}
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col pr-1 sm:pl-0 pl-4">
        <div className="flex items-center justify-between sm:hidden mb-4">
          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-2 border border-[#191973] text-[#191973] px-3 py-1 rounded-md text-sm font-medium"
          >
            <FaChevronRight className="rotate-90" />
            FILTERS
          </button>
        </div>
        <div className="flex justify-between text-base sm:text-2xl mb-4 pr-2">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          <div className="relative group text-[#191973]">
            <button className="bg-zinc-100 border-2 border-[#191973] rounded-md px-3 py-1 flex items-center gap-2 text-sm font-medium w-40 justify-between">
              <span className="flex items-center gap-2">
                Sort By
              </span>
              <FaChevronRight className="group-hover:rotate-90 transition-transform" />
            </button>
            <div className="absolute z-10 hidden group-hover:flex flex-col mt-1 w-40 bg-white border-2 border-[#191973] rounded-md shadow-md text-sm font-medium">
              {["relavent", "low-high", "high-low"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSortType(type)}
                  className={`px-3 py-2 hover:bg-zinc-100 flex items-center justify-between ${
                    sortType === type ? "bg-zinc-100" : ""
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {type === "relavent" && <FaSort />}
                    {type === "low-high" && <FaSortAmountDown />}
                    {type === "high-low" && <FaSortAmountUpAlt />}
                    {type.replace("-", " ").toUpperCase()}
                  </span>
                  {sortType === type && <FaRegCheckCircle />}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div
          className="overflow-y-auto pr-2 pl-2 pt-5"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pl-1 sm:pl-5">
            {filterProducts.map((item, index) => (
              <motion.div
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
        </div>
      </div>
    </div>
  );
};
export default Collection;
