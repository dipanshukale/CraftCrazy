import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const HomePage = () => {
  const [toast, setToast] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setToast(location.state?.message);
      setTimeout(() => setToast(null), 4000);
    }
  }, [location.state]);

  useEffect(() => {
    const savedScroll = sessionStorage.getItem("scrollPosition");
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll, 10));
    }
  }, []);

  return (
    <div className="bg-[#FBFAF7]">
      {/* 🌟 Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <img
          src="./hero5.jpg"
          alt="Handmade Gifts"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center sm:object-[center_top]"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-black/60 md:bg-gradient-to-r md:from-black/70 md:via-black/50 md:to-transparent"></div>

        {/* Hero Content */}
        <div className="absolute z-10 flex items-center justify-center w-full h-full px-4 sm:px-8 md:px-16 text-center">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="p-5 sm:p-8 md:p-12 rounded-3xl max-w-[95%] sm:max-w-2xl"
          >
            {/* Heading */}
            <h1 className="text-[1.6rem] xs:text-2xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-snug sm:leading-tight tracking-wide drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
              Handmade Gifts <br />
              That Speak from the{" "}
              <span className="text-[#E6CFA9]">Heart</span>
            </h1>

            {/* Divider */}
            <div className="w-12 sm:w-16 h-[3px] mx-auto bg-[#E6CFA9] mb-4 sm:mb-6 rounded-full"></div>

            {/* Subheading */}
            <p className="text-[0.9rem] xs:text-base sm:text-lg md:text-xl text-white/90 mb-6 font-serif leading-relaxed max-w-md sm:max-w-xl mx-auto drop-shadow-[0_3px_5px_rgba(0,0,0,0.4)]">
              Discover our unique collection of hampers, frames, accessories, and
              more — each crafted with{" "}
              <span className="text-[#E6CFA9] font-semibold">love & care</span>.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center">
              <Link
                to="/newarrivals"
                className="px-5 sm:px-8 py-2.5 sm:py-3 bg-[#FFF0CE] hover:bg-[#e4d3b3] rounded-full text-[#7b4b2b] font-semibold text-sm sm:text-lg transition-all transform hover:scale-105 shadow-md active:scale-95"
              >
                Shop Now
              </Link>
              <Link
                to="/aboutus"
                className="px-5 sm:px-8 py-2.5 sm:py-3 bg-transparent border border-[#E6CFA9] hover:bg-[#E6CFA9]/20 rounded-full text-[#E6CFA9] font-semibold text-sm sm:text-lg transition-all transform hover:scale-105 shadow-sm active:scale-95"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🌟 Toast Message */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-[#E8D4B7] text-[#3c1f2c] px-6 py-3 rounded-lg shadow-lg text-sm sm:text-base"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
