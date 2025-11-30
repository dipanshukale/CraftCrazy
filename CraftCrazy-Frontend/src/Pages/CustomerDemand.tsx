import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getApiUrl } from "../utils/apiConfig";

type FormData = {
  name: string;
  email: string;
  phone: string;
  product: string;
  customization: string;
  image: File | null;
};

const howItWorksSteps = [
  { id: 1, title: "Share Your Idea", description: "Tell us your vision, from trays to keepsakes.", icon: "💡" },
  { id: 2, title: "Select Customization", description: "Choose colors, materials, and design.", icon: "🎨" },
  { id: 3, title: "Crafted with Love", description: "Our artisans handcraft your bespoke piece.", icon: "🛠️" },
  { id: 4, title: "Receive with Elegance", description: "Enjoy your premium creation delivered with care.", icon: "🎁" },
];

const reels = [
  { id: 1, video: "herhamper.mp4" },
  { id: 2, video: "blood.mp4" },
  { id: 3, video: "diya.mp4" },
  { id: 4, video: "reel1.mp4" },
  { id: 5, video: "flower.mp4" },
  { id: 6, video: "lastone.mp4" },
];

const CustomerDemandPremium = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    product: "",
    customization: "",
    image: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const {isAuthenticated} = useAuth();

  const reelContainerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // 🎞️ Smooth infinite auto-scroll
  const startScrolling = () => {
    const scrollContainer = reelContainerRef.current;
    if (!scrollContainer) return;

    let scrollAmount = scrollContainer.scrollLeft;
    const speed = window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 1.5 : 2;

    const scroll = () => {
      if (!scrollContainer) return;
      scrollAmount += speed;
      if (scrollAmount >= scrollContainer.scrollWidth / 2) scrollAmount = 0;
      scrollContainer.scrollLeft = scrollAmount;
      rafRef.current = requestAnimationFrame(scroll);
    };

    rafRef.current = requestAnimationFrame(scroll);
  };

  const stopScrolling = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  // Start auto-scroll on mount
  useEffect(() => {
    startScrolling();
    return () => stopScrolling();
  }, []);

  // Image preview with cleanup
  useEffect(() => {
    if (!formData.image) {
      setImagePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(formData.image);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [formData.image]);

  // Auto-hide submitted message
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setSubmitted(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  // ✅ handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const files = e.target.files;
      if (files && files.length > 0) setFormData(prev => ({ ...prev, image: files[0] }));
    } else setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ handle form submit (connected to backend API)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
      if (!token && !isAuthenticated) {
      toast.error("Please login to add items to your cart!");
      localStorage.removeItem("token");
      return;
    }

    if (submitting) return;

    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("product", formData.product);
      formDataToSend.append("customization", formData.customization);
      if (formData.image) formDataToSend.append("image", formData.image);

      const res = await axios.post(
        getApiUrl("api/demand/create"),
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 200 || res.status === 201) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          product: "",
          customization: "",
          image: null,
        });
        setImagePreview(null);
      }
    } catch (error) {
      console.error("Error submitting demand:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#FFFDF9] overflow-hidden">
      {/* HERO */}
      <div className="relative w-full h-[260px] sm:h-[380px] md:h-[500px] flex items-center justify-center text-center">
        <img src="banner.jpg" alt="Crafting"  loading="lazy" className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-3">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-serif text-white drop-shadow-xl font-bold">
            Customize Your Demand
          </h1>
          <p className="mt-2 text-sm sm:text-lg md:text-2xl italic text-white drop-shadow-md font-light">
            With CraftiCrazy — Crafted With Care
          </p>
        </div>
      </div>

      {/* AUTO-SCROLLING REELS */}
      <motion.div className="relative w-full py-10 sm:py-14 rounded-3xl shadow-lg mt-8 sm:mt-12 border border-gray-200 bg-gradient-to-b from-[#FFF8F1] to-[#FFFDF9]">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8b5e34] font-serif text-center mb-6 sm:mb-8">
          Sanika&apos;s Creations
        </h2>
        <div
          ref={reelContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-hidden no-scrollbar px-3 sm:px-6 relative"
          onMouseEnter={stopScrolling}
          onMouseLeave={startScrolling}
          onTouchStart={stopScrolling}
          onTouchEnd={startScrolling}
        >
          {[...reels, ...reels].map((reel, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="min-w-[180px] sm:min-w-[220px] md:min-w-[280px] rounded-2xl shadow-lg overflow-hidden bg-white border border-gray-100 transition-all duration-300"
            >
              <div className="relative w-full h-60 sm:h-62 md:h-74 rounded-2xl overflow-hidden">
                <video
                  src={reel.video}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-label={`Reel ${index + 1}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* FORM + WHY WE CREATE */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col lg:flex-row justify-center items-center gap-10 w-full md:w-4/5 mx-auto mb-16 mt-14 px-4 sm:px-6"
      >
        {/* FORM */}
        <div className="w-full lg:w-5/12 bg-white p-5 sm:p-8 rounded-2xl shadow-2xl border border-gray-100 text-center lg:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8b5e34] mb-3">Share Your Dream</h2>
          <p className="text-gray-600 mb-5 sm:mb-7 font-[Playfair_Display] text-sm sm:text-base">
            Your vision, our craftsmanship.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4 w-full">
            {["name", "email", "phone", "product"].map((field) => (
              <input
                key={field}
                type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                name={field}
                value={formData[field as keyof FormData] as string}
                onChange={handleChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#c9a26d] focus:outline-none text-sm sm:text-base"
              />
            ))}

            <textarea
              name="customization"
              value={formData.customization}
              onChange={handleChange}
              placeholder="How do you want to customize it?"
              rows={3}
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#c9a26d] resize-none text-sm sm:text-base"
            />

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full py-2 px-3 rounded-xl border border-gray-300 cursor-pointer focus:ring-2 focus:ring-[#c9a26d] text-sm"
            />

            {imagePreview && (
              <div className="relative mt-2 w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-lg overflow-hidden shadow-md border border-gray-200">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, image: null }))}
                  className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: submitting ? 1 : 1.05 }}
              disabled={submitting}
              className={`mt-4 py-2 w-full cursor-pointer bg-gradient-to-r from-[#c9a26d] to-[#8b5e34] text-white font-medium rounded-xl shadow-md text-sm sm:text-base ${
                submitting ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? "Submitting..." : "Submit"}
            </motion.button>
          </form>

          <AnimatePresence>
            {submitted && (
              <motion.p
                key="success"
                className="mt-3 text-green-600 font-medium text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                ✅ Your request has been recorded!
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* WHY WE CREATE */}
        <div className="w-full lg:w-5/12 bg-[#FFF8F1] p-5 sm:p-8 rounded-2xl shadow-lg border border-gray-100 text-center lg:text-left">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#8b5e34] mb-3">Why We Create</h3>
          <p className="text-gray-700 text-sm sm:text-base md:text-lg italic font-[Playfair_Display] mb-6 max-w-lg mx-auto">
            Behind every piece we craft lies a story waiting to be told. From delicate keepsakes to stunning wedding
            treasures, each creation is infused with passion, artistry, and a touch of magic.
          </p>
        </div>
      </motion.div>

      {/* HOW IT WORKS */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 px-4 sm:px-6 mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {howItWorksSteps.map((step) => (
          <motion.div
            key={step.id}
            whileHover={{ scale: 1.07, y: -5 }}
            className="flex flex-col items-center text-center p-5 sm:p-6 rounded-3xl bg-white shadow-xl border border-gray-100"
          >
            <div className="text-4xl sm:text-5xl mb-3">{step.icon}</div>
            <h3 className="font-semibold text-lg text-[#8b5e34] mb-1">{step.title}</h3>
            <p className="text-gray-700 text-sm sm:text-base">{step.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default CustomerDemandPremium;
