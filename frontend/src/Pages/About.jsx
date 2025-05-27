import React, { useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetterBox from "../components/NewsLetterBox";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
const About = () => {
  const [showMore, setShowMore] = useState(false);
  return (
    <div>
      <div className='text-2xl text-center py-10 border-t border-[#191973]'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-10'>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='w-full md:max-w-[450px] border border-[#191973] rounded-lg flex items-center justify-center bg-zinc-50 text-[#191973] h-[300px]'
        >
          <RiTeamFill size={150} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='bg-zinc-100 flex flex-col gap-4 text-[#101049] p-5 border border-[#191973] rounded-lg w-full max-h-[300px] overflow-y-auto'
        >
          <b className='text-[#191973] text-xl'>Welcome to Forever</b>
          <p className='text-sm'>
            Forever was born out of a passion for innovation and a desire to revolutionize the way people shop online.
            {showMore && (
              <>
                {" "}Our journey began with a simple idea: to provide a platform where customers can easily discover, explore, and purchase a wide range of products from the comfort of their homes.
              </>
            )}
          </p>
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-blue-700 hover:underline w-fit text-sm"
          >
            {showMore ? "Show Less" : "Read More"}
          </button>
          <b className='text-[#191973] text-xl'>Our Mission</b>
          <p className='text-sm'>
            Our mission at Forever is to empower customers with choice, convenience, and confidence. We're dedicated to providing a seamless shopping experience that exceeds expectations, from browsing and ordering to delivery and beyond.
          </p>
          <p className='text-sm'>
            Our mission at Forever is to empower customers with choice, convenience, and confidence. We're dedicated to providing a seamless shopping experience that exceeds expectations, from browsing and ordering to delivery and beyond.
          </p>
          <p className='text-sm'>
            Our mission at Forever is to empower customers with choice, convenience, and confidence. We're dedicated to providing a seamless shopping experience that exceeds expectations, from browsing and ordering to delivery and beyond.
          </p>
        </motion.div>
      </div>
      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20 gap-10'>
        {[
          {
            title: "Quality Assurance",
            content: "We meticulously select and vet each product to ensure it meets our stringent quality standards.",
          },
          {
            title: "Convenience",
            content: "With our user-friendly interface and hassle-free ordering process, shopping has never been easier.",
          },
          {
            title: "Exceptional Customer Service",
            content: "Our team of dedicated professionals is here to assist you every step of the way, ensuring your satisfaction is our top priority.",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className='hover:scale-[1.02] hover:shadow-xl transition-all duration-300 bg-zinc-100 border border-[#191973] rounded-md px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 text-[#191973]'
          >
            <b className='flex items-center gap-2'>
              <FaCheckCircle className="text-green-600" /> {item.title}
            </b>
            <p className='text-[#101049]'>{item.content}</p>
          </motion.div>
        ))}
      </div>
      {/* <NewsLetterBox /> */}
    </div>
  );
};
export default About;
