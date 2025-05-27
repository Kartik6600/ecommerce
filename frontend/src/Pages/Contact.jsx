import React from "react";
import Title from "../components/Title";
import NewsLetterBox from "../components/NewsLetterBox";
import { motion } from "framer-motion";
import { FiMessageSquare } from "react-icons/fi";
const Contact = () => {
  return (
    <div className="py-10 border-t border-[#191973]">
      <div className='text-center text-2xl'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className='w-full md:max-w-[480px] border border-[#191973] rounded-lg hover:shadow-xl hover:scale-[1.01] transition-transform duration-300 flex items-center justify-center text-[#191973] bg-zinc-50 text-[140px]'
        >
          <FiMessageSquare />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-zinc-100 flex flex-col justify-center items-start gap-6 border border-[#191973] rounded-lg p-6 text-[#101049] md:w-2/4"
        >
          <p className="font-semibold text-xl text-[#191973]">Our Store</p>
          <p>Sarkhej - Gandhinagar Highway,<br />Ahmedabad, Gujarat, India</p>
          <p>
            Tel: <a href="tel:+918401884854" className="text-blue-700 hover:underline">+91 8401884854</a><br />
            Email: <a href="mailto:admin@forever.com" className="text-blue-700 hover:underline">admin@forever.com</a>
          </p>
          <p>Our team of dedicated professionals is here to assist you every step of the way, ensuring your satisfaction is our top priority.</p>
        </motion.div>
      </div>
      {/* <NewsLetterBox /> */}
    </div>
  );
};
export default Contact;