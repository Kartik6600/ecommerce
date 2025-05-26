import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname.includes("collection")) {
      setVisible(true);
    } else if (showSearch) {
      navigate("/collection");
    } else {
      setVisible(false);
    }
  }, [location, showSearch, navigate]);
  return showSearch && visible ? (
    <div className="border-t border-b text-center py-3 shadow-sm transition-all">
      <div className="inline-flex items-center border border-[#191973] px-4 py-2 rounded-full w-3/4 sm:w-1/2 bg-zinc-100 shadow-sm hover:shadow-md transition-all duration-300">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none bg-inherit text-sm text-[#101049] placeholder-gray-500"
          type="text"
          placeholder="Search"
        />
        <FaSearch className="text-[#191973] ml-2" />
      </div>
      <IoMdClose
        onClick={() => setShowSearch(false)}
        className="inline ml-3 text-lg text-red-500 cursor-pointer hover:scale-110 transition-transform duration-200"
      />
    </div>
  ) : null;
};
export default SearchBar;
