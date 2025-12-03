import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const SuccessPage: React.FC = () => {
  const location = useLocation();
  const message =
    location.state?.message || "Your order has been placed successfully!";

  useEffect(() => {
    Swal.fire({
      icon: "success",
      title: "Payment Successful 🎉",
      text: message,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      position: "center",
      allowOutsideClick: false,
      background: "#ffffff",
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f3] px-4">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-10 sm:p-14 rounded-3xl shadow-xl text-center max-w-md w-full"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
          alt="Success Icon"
          className="w-28 h-28 mx-auto mb-6"
        />
        <h1 className="text-3xl sm:text-4xl font-bold text-[#5b2232] mb-4">
          Order Confirmed!
        </h1>
        <p className="text-gray-700 text-base sm:text-lg mb-8">
          {message}
        </p>
        <Link
          to="/newarrivals"
          className="bg-[#5b2232] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#451a27] transition-all duration-300"
        >
          Continue Shopping
        </Link>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
