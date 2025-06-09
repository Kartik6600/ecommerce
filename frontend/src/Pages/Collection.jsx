import React, { useContext, useState, useMemo } from "react";
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
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [size, setSize] = useState([]);
  const [sortType, setSortType] = useState("relavent");
  const categoryOptions = useMemo(() => 
    [...new Set(products.map(item => item.category).filter(Boolean))],
    [products]
  );
  const subCategoryOptions = useMemo(() => 
    [...new Set(products.map(item => item.subCategory).filter(Boolean))],
    [products]
  );
  const sizeOptions = useMemo(() => 
    [...new Set(products.flatMap(item => item.sizes || []).filter(Boolean))], 
    [products]
  );
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];
    if (showSearch && search) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()))
    }
    if (category.length) {
      filtered = filtered.filter(item => category.includes(item.category));
    }
    if (subCategory.length) {
      filtered = filtered.filter(item => subCategory.includes(item.subCategory));
    }
    if (size.length) {
      filtered = filtered.filter(item => 
        item.sizes?.some(s => size.includes(s))
      );
    }
    if (sortType === "low-high") {
      return [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }
    return filtered;
  }, [products, category, subCategory, size, search, showSearch, sortType]);
  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory(prev => 
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };
  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory(prev => 
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };
  const toggleSize = (e) => {
    const value = e.target.value;
    setSize(prev => 
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };
  return (
    <div className="flex flex-col md:flex-row pt-4 md:pt-10 h-full min-h-screen">
      {/* Filter sidebar */}
      <div className={`fixed md:static top-0 left-0 bg-black md:bg-transparent z-30 md:z-auto w-3/4 md:w-64 h-full md:h-auto overflow-y-auto md:overflow-visible transition-transform duration-300 ease-in-out ${showFilter ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-4 md:p-0 md:pr-4">
          <div className="flex justify-end md:hidden mb-4">
            <button onClick={() => setShowFilter(false)} className="text-[#00bfff] text-2xl">
              <FaTimes />
            </button>
          </div>
          <p className="my-2 text-xl font-semibold text-[#FBCFE8]">FILTERS</p>
          <div className="mb-4 space-y-4">
            <FilterGroup 
              title="CATEGORIES" 
              options={categoryOptions} 
              toggle={toggleCategory} 
            />
            <FilterGroup 
              title="TYPE" 
              options={subCategoryOptions} 
              toggle={toggleSubCategory} 
            />
            <FilterGroup 
              title="SIZE" 
              options={sizeOptions} 
              toggle={toggleSize} 
            />
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col px-4 md:px-8">
        <div className="text-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 py-10">
          <Title text1="ALL" text2="COLLECTIONS" />
          <div className="relative group text-[#191973] self-start sm:self-auto bg-zinc-100">
            <button className="border-2 border-[#FBCFE8] rounded-md px-3 py-1 flex items-center gap-2 text-sm font-medium w-40 justify-between">
              <span className="flex text-[#191973] items-center gap-2">Sort By</span>
              <FaChevronRight className="group-hover:rotate-90 text-[#191973] transition-transform" />
            </button>
            <div className="absolute z-10 hidden group-hover:flex flex-col mt-1 w-40 border-2 border-[#FBCFE8] rounded-md bg-zinc-100 shadow-md text-sm font-medium">
              {["relavent", "low-high", "high-low"].map(type => (
                <button
                  key={type}
                  onClick={() => setSortType(type)}
                  className={`px-3 py-2 flex items-center justify-between ${sortType === type ? "" : ""}`}
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
        {/* Mobile filter button */}
        <div className="mb-4 md:hidden">
          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-2 border border-[#FBCFE8] text-[#00bfff] px-3 py-1 rounded-md text-sm font-medium"
          >
            <FaChevronRight className="rotate-90" />
            FILTERS
          </button>
        </div>
        {/* Products grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-28">
          {filteredAndSortedProducts.map((item, index) => (
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
    </div>
  );
};
const FilterGroup = ({ title, options, toggle }) => (
  <div className="border-2 border-[#FBCFE8] rounded-md p-4 bg-zinc-100">
    <p className="mb-3 text-sm font-medium text-[#191973]">{title}</p>
    <div className="flex flex-col gap-2 text-sm font-light text-orange-800">
      {options.map(option => (
        <label key={option} className="flex gap-2 items-center">
          <input
            type="checkbox"
            value={option}
            onChange={toggle}
            className="w-3 h-3"
          />
          {option}
        </label>
      ))}
    </div>
  </div>
);
export default Collection;