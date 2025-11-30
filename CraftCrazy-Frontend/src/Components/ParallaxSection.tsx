import { Parallax } from "react-parallax";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const Newsletter = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const Content = (
    <div className="relative min-h-[300px] sm:min-h-[400px] flex flex-col items-center justify-center text-center px-4 sm:px-6">
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Actual Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-xl font-[Playfair_Display] leading-snug"
        >
          Get Your Latest Update!
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-100 max-w-md sm:max-w-2xl leading-relaxed px-2"
        >
          Be the first to discover{" "}
          <span className="font-semibold text-[#ff8fab]">exclusive offers</span>,  
          <span className="italic text-[#f72585]"> artisanal collections</span>, and festive surprises.
        </motion.p>

        {/* Newsletter Form */}
        <motion.form
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-white/20 backdrop-blur-lg p-3 sm:p-4 rounded-2xl shadow-xl w-full max-w-lg"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 sm:py-3 rounded-xl w-full sm:w-72 md:w-96 outline-none text-gray-900 text-sm sm:text-base"
            required
          />
          <button
            type="submit"
            className="px-5 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-[#AB420A] to-[#D98B4A] 
                       text-white font-semibold text-sm sm:text-base shadow-lg hover:scale-105 
                       transition-transform duration-300 w-full sm:w-auto"
          >
            Subscribe
          </button>
        </motion.form>
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? (
        // Static background for mobile (better performance)
        <div
          className="bg-cover bg-center relative"
          style={{ backgroundImage: "url('/bg.jpg')" }}
        >
          {Content}
        </div>
      ) : (
        // Parallax for desktop/tablet
        <Parallax blur={0} bgImage="/bg.jpg" strength={300}>
          {Content}
        </Parallax>
      )}
    </>
  );
};

export default Newsletter;
