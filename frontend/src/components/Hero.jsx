import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
function Hero() {
  return (
    <Link to="/collection">
      <div className="flex flex-col sm:flex-row border-2 border-[#191973] rounded-md cursor-pointer bg-zinc-100" >
        <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
          <div className="text-[#414141]">
            <div className="flex items-center space-x-2">
              <p className="w-8 md:w-11 h-[2px] bg-[#101049]"></p>
              <p className="font-medium text-sm md:text-base text-[#101049]">OUR BESTSELLERS</p>
            </div>
            <h1 className="prata-regular text-3xl sm:py-5 lg:text-5xl text-[#191973]"> Latest Arrivals </h1>
            <div className="flex items-center space-x-2">
              <p className="font-semibold text-sm md:text-base text-[#101049]">SHOP NOW</p>
              <p className="w-8 md:w-11 h-[1px] bg-[#101049]"></p>
            </div>
          </div>
        </div>
        <img
          className="w-full sm:w-1/2 border border-[#191973] rounded-md"
          src={assets.hero_img}
          alt=""
        />
      </div>
    </Link>
  );
}
export default Hero;
