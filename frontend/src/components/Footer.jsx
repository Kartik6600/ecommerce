import React from "react"
import { assets } from "../assets/assets"
const Footer = () => {
  return (
    <div>
        <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 py-2 text-sm border-t border-[#FBCFE8]">
            <div>
                <img src={assets.logo} className="mb-5 w-32" alt="" />
                <p className="w-full md:w-2/3 text-orange-400">
  Discover timeless style with our thoughtfully crafted clothing. From everyday essentials to standout pieces, we blend comfort, quality, and design to help you express your unique look with confidence.
</p>
            </div>
            <div>
                <p className="text-xl font-medium mb-5 text-[#00bfff]">COMPANY</p>
                <ul className="flex flex-col gap-1 text-orange-400">
                    <li>Home</li>
                    <li>Collection</li>
                    <li>About Us</li>
                    <li>Contact</li>
                </ul>
            </div>
            <div>
                <p className="text-xl font-medium mb-5 text-[#00bfff]">GET IN TOUCH</p>
                <ul className="flex flex-col gap-1 text-orange-400">
                    <li>1800-226-8558</li>
                    <li><a href="mailto:forever.dev@gmail.com">forever.dev@gmail.com</a></li>
                    <li>Customor Care: </li>
                    <li><a href="tel:9428242437">9428242437</a></li>
                </ul>
            </div>
        </div>
            <div className="opacity-70">
                <hr />
                    <p className="py-2 text-sm text-center text-blue-200">Copyright 2025@ forever.dev - All Right Reserved.</p>
            </div>
    </div>
  )
}
export default Footer
