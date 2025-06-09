import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
function Hero() {
  return (
    <Link to="/collection">
      <div className="mt-10 flex flex-col sm:flex-row border-2 border-[#FBCFE8] rounded-md cursor-pointer" >
        <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0 bg-zinc-100">
          <div className="text-[#414141]">
            <div className="flex items-center space-x-2">
              <p className="w-8 md:w-11 h-[2px] bg-orange-400"></p>
              <p className="font-medium text-sm md:text-base text-[#00bfff]">OUR BESTSELLERS</p>
            </div>
            <h1 className="prata-regular text-3xl sm:py-5 lg:text-5xl text-orange-400"> Latest Arrivals </h1>
            <div className="flex items-center space-x-2">
              <p className="font-semibold text-sm md:text-base text-[#00bfff]">SHOP NOW</p>
              <p className="w-8 md:w-11 h-[1px] bg-orange-400"></p>
            </div>
          </div>
        </div>
        <img
          className="w-full sm:w-1/2 rounded-md"
          src={assets.hero_img}
          alt=""
        />
      </div>
    </Link>
  );
}
export default Hero;
