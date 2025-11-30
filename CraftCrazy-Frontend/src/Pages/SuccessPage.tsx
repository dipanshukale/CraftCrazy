import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";

const SuccessPage: React.FC = () => {
  const location = useLocation();
  const message = location.state?.message || "Your order has been placed successfully!";

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    });
  }, [controls]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffdf7] px-4">
      <motion.div
        initial={{ y: -100, opacity: 0 }} // start from top
        animate={controls}
        className="bg-white p-8 sm:p-12 rounded-2xl shadow-lg text-center"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/845/845646.png" // success icon
          alt="Success"
          className="w-24 h-24 mx-auto mb-6"
        />
        <h1 className="text-2xl sm:text-3xl font-bold text-[#5b2232] mb-4">Order Confirmed!</h1>
        <p className="text-gray-700 mb-6">{message}</p>
        <Link
          to="/newarrivals"
          className="bg-[#5b2232] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#451a27] transition duration-200"
        >
          Continue Shopping
        </Link>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
