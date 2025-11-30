import { useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  onClose: () => void;
  isOpen?: boolean; 
};

const LoginPromptModal = ({ onClose, isOpen = true }: Props) => {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            key="modal"
            initial={{ scale: 0.95, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full border border-gray-100"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-700 transition"
              aria-label="Close modal"
            >
              <X size={22} className="sm:size-5 cursor-pointer" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 bg-gradient-to-tr from-orange-100 to-pink-100 text-orange-600 flex items-center justify-center rounded-full text-3xl shadow-md">
                🎁
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-2xl font-semibold text-gray-800 text-center leading-tight">
              Welcome to{" "}
              <span className="text-orange-500 font-bold">CraftiCrazy</span>
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-center mt-3 text-sm sm:text-base px-1">
              Sign in or create your account to explore our handcrafted hampers,
              personalized gifts & more made just for you.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-8">
              <Link
                to="/login"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-white font-medium bg-gradient-to-r from-orange-500 to-pink-500 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-orange-400 text-orange-600 font-medium hover:bg-orange-50 hover:shadow-md transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginPromptModal;
