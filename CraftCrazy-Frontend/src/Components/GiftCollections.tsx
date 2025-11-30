import { useEffect } from "react";
import { Gift, RotateCcw, Percent, Headphones, Truck } from "lucide-react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { giftCategories } from "../Data/GiftCategories";

export default function GiftCollections() {
  const steps = [
    {
      id: 1,
      title: "Free Shipping",
      description: "Free Shipping — Final shipping charges calculated at checkout.",
      icon: <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-[#8C5E3C]" />,
    },
    {
      id: 2,
      title: "30 Days Returns",
      description: "Hassle-free returns within 30 days",
      icon: <RotateCcw className="w-6 h-6 sm:w-8 sm:h-8 text-[#8C5E3C]" />,
    },
    {
      id: 3,
      title: "Member Discount",
      description: "Exclusive offers for members",
      icon: <Percent className="w-6 h-6 sm:w-8 sm:h-8 text-[#8C5E3C]" />,
    },
    {
      id: 4,
      title: "24/7 Support",
      description: "Always ready to assist",
      icon: <Headphones className="w-6 h-6 sm:w-8 sm:h-8 text-[#8C5E3C]" />,
    },
  ];

  const offers = [
    {
      id: 1,
      title: "Flat 30% OFF",
      subtitle: "Custom Resin Ring Tray",
      image: "Trayfront.jpg",
      link: "/Tray",
    },
    {
      id: 2,
      title: "20% OFF",
      subtitle: "Birthday Hamper",
      image: "Hamper.jpeg",
      link: "/BirthdayHamper",
    },
    {
      id: 3,
      title: "Limited Offer",
      subtitle: "Gift Hampers for Christmas",
      image: "ChristmasHamper1-2.jpg",
      link: "/christmas",
    },
  ];

  const controls = useAnimation();
  useEffect(() => {
    controls.start({
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    });
  }, [controls]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 font-[Poppins] bg-[#FAF8F4]">
      {/* HOW IT WORKS */}
      <section className="bg-white mb-12 py-8 rounded-xl shadow-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-200">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center justify-center text-center px-3 py-5 hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="mb-2">{step.icon}</div>
              <h3 className="text-sm sm:text-base font-semibold text-[#8C5E3C]">
                {step.title}
              </h3>
              <p className="text-[11px] sm:text-sm text-gray-600 mt-1 leading-tight">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* OFFERS SECTION */}
      <section className="py-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-6">
        {/* Left Big Offer */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden shadow-md group cursor-pointer"
        >
          <img
            src={offers[0].image}
            alt={offers[0].subtitle}
            loading="lazy"
            className="w-full h-60 sm:h-[700px] object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex flex-col justify-end p-6 text-white">
            <p className="text-sm uppercase tracking-wide font-medium">
              {offers[0].title}
            </p>
            <h3 className="text-2xl sm:text-3xl font-serif font-semibold mb-3">
              {offers[0].subtitle}
            </h3>
            <Link
              to={offers[0].link}
              className="border border-white text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white hover:text-[#8C5E3C] transition"
            >
              Shop Now
            </Link>
          </div>
        </motion.div>

        {/* Right Smaller Offers */}
        <div className="grid gap-5">
          {offers.slice(1).map((offer, idx) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden shadow group cursor-pointer"
            >
              <img
                src={offer.image}
                alt={offer.subtitle}
                loading="lazy"
                className="w-full h-46 sm:h-85 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4 text-white">
                <p className="text-[10px] sm:text-xs uppercase tracking-wide font-medium">
                  {offer.title}
                </p>
                <h3 className="text-sm sm:text-lg font-serif font-semibold mb-2">
                  {offer.subtitle}
                </h3>
                <Link
                  to={offer.link}
                  className="border border-white text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-white hover:text-[#8C5E3C] transition"
                >
                  Shop Now
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HEADER SECTION */}
      <div className="text-center mb-12 mt-8 px-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#8C5E3C] font-semibold">
          Luxury Gift Collections
        </h1>
        <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Discover{" "}
          <span className="font-semibold italic text-[#A8733B]">
            artisanal creations
          </span>{" "}
          blending{" "}
          <span className="text-[#8C5E3C] italic font-medium">elegance</span> &{" "}
          <span className="italic text-[#A8733B]">luxury</span>. Crafted to make
          every moment unforgettable.
        </p>
      </div>

      {/* Gift Categories */}
      <div className="max-w-7xl mx-auto space-y-16 sm:space-y-20">
        {giftCategories.map((category) => (
          <div key={category.id} className="space-y-6">
            {/* Category Title */}
            <div className="text-center">
              <h2 className="text-xl sm:text-3xl font-serif text-[#8C5E3C] flex items-center justify-center gap-2">
                <Gift className="w-6 h-6 sm:w-7 sm:h-7 text-[#D9A441]" />
                {category.name}
              </h2>
              <p className="text-xs sm:text-base italic text-[#8C5E3C] mt-1">
                {category.tagline}
              </p>
            </div>

            {/* Product Scroll Cards */}
            <div className="flex justify-center flex-wrap gap-6">
              <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory py-3 no-scrollbar">
                <AnimatePresence>
                  {category.variants.map((variant) => (
                    <motion.div
                      key={variant.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.4 }}
                      className="group flex-shrink-0 w-[220px] sm:w-[280px] md:w-[300px] snap-center"
                    >
                      <Link to={variant.link} className="h-full">
                        <div className="relative w-full h-64 sm:h-72 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-transform duration-500 hover:-translate-y-1 hover:scale-[1.02]">
                          <img
                            src={variant.image}
                            alt={variant.name}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <FiArrowRight className="text-white w-6 h-6 sm:w-8 sm:h-8" />
                          </div>
                        </div>
                        <div className="mt-3 text-center">
                          <p className="text-base sm:text-lg text-gray-900 font-serif font-semibold leading-snug">
                            {variant.name}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
