import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Instagram, MessageCircle, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getApiUrl } from "../utils/apiConfig";

type FormState = { name: string; email: string; phone: string; message: string; };
const initialForm: FormState = { name: "", email: "", phone: "", message: "" };

const ContactUs: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [sent, setSent] = useState(false);

  const handleChange =
    (k: keyof FormState) =>
    (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [k]: ev.target.value }));
    };

  const handleSubmit = async (ev: React.FormEvent) => {
  ev.preventDefault();

  try {
    const res = await fetch(getApiUrl("api/contact/add"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      setSent(true);
       toast.success(`Your Message Sent Successfully we will connect you soon.`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setForm(initialForm);
    } else {
      toast.error("Message Not sent some error occured.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Something went wrong! Please try again later.");
  }
};


  // Auto-hide toast using useEffect
  useEffect(() => {
    if (sent) {
      const timer = setTimeout(() => setSent(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [sent]);

  return (
    <div className="bg-gray-50 min-h-screen">
     <ToastContainer />
      {/* Header */}
      <div className="bg-gray-50 text-center py-13 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 shadow-md">
        <h1 className="text-4xl md:text-4xl font-[Playfair_Display] font-bold text-gray-900 relative inline-block">
          Contact Us
        </h1>
        <h3 className="text-xl font-semibold text-amber-600 mb-2">Sanika Milmile</h3>
        <p className="text-lg text-[#8b5e34] italic max-w-xl mx-auto">
          “Turning your craft dreams into reality!”
        </p>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto py-14 px-6 grid md:grid-cols-2 gap-10">
        {/* Left: Map */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 h-[500px]"
        >
          <iframe
            title="CraftiCrazy Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3731.233253124482!2d79.2981!3d19.9596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a2d3f5a3f7f2a3b%3A0x3a2d3f5a3f7f2a3b!2sChandrapur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1694600000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </motion.div>

        {/* Right: Contact Form + Socials */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-between bg-white shadow-xl rounded-2xl p-8 border border-gray-100"
        >
          {/* Form */}
          <div>
            <h2 className="text-3xl md:text-3xl font-extrabold text-gray-900 mb-6 flex items-center justify-center gap-3">
              <span className="text-[#AB420A] animate-bounce">
                <Send className="w-6 h-6" />
              </span>
              Let’s Craft Together
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                value={form.name}
                onChange={handleChange("name")}
                type="text"
                placeholder="Your Name"
                className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#D98B4A] outline-none shadow-sm transition"
                required
              />
              <input
                value={form.email}
                onChange={handleChange("email")}
                type="email"
                placeholder="Your Email"
                className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#D98B4A] outline-none shadow-sm transition"
                required
              />
              <input
                value={form.phone}
                onChange={handleChange("phone")}
                type="tel"
                placeholder="Your Phone"
                className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#D98B4A] outline-none shadow-sm transition"
              />
              <textarea
                value={form.message}
                onChange={handleChange("message")}
                rows={4}
                placeholder="Message"
                className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#D98B4A] outline-none shadow-sm transition"
                required
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-40 bg-gradient-to-r cursor-pointer from-[#AB420A] to-[#D98B4A] text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-[#ddbea9] transition"
              >
                Send Message
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Contact Cards */}
      <div className="max-w-full grid sm:grid-cols-2 lg:grid-cols-5 rounded-3xl p-9 mb-9 mt-2 gap-4">
        <div className="flex flex-col items-center text-center p-4 bg-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <MapPin className="w-8 h-8 text-amber-500 mb-2" />
          <h4 className="font-semibold text-gray-800">Our Address</h4>
          <p className="text-sm text-gray-600 mt-1">Chandrapur, Maharashtra, India</p>
        </div>

        <div className="flex flex-col items-center text-center p-4 bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <Phone className="w-8 h-8 text-green-500 mb-2" />
          <h4 className="font-semibold text-gray-800">Phone</h4>
          <p className="text-sm text-gray-600 mt-1">+91 7721028815</p>
        </div>

        <div className="flex flex-col items-center text-center p-4 bg-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <Mail className="w-8 h-8 text-red-600 mb-2" />
          <h4 className="font-semibold text-gray-800">Email</h4>
          <p className="text-sm text-gray-600 mt-1">crafticrazy@gmail.com</p>
        </div>

        <div className="flex flex-col items-center text-center p-4 bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <Instagram className="w-8 h-8 text-pink-500 mb-2" />
          <h4 className="font-semibold text-gray-800">Instagram</h4>
          <p className="text-sm text-gray-600 mt-1">@crafticrazy_710</p>
        </div>

        <div className="flex flex-col items-center text-center p-4 bg-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <MessageCircle className="w-8 h-8 text-green-500 mb-2" />
          <h4 className="font-semibold text-gray-800">WhatsApp</h4>
          <p className="text-sm text-gray-600 mt-1">+91 7721028815</p>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {sent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 bg-white shadow-xl rounded-xl border border-green-200 px-6 py-4 flex items-center gap-3"
          >
            <div className="text-green-600 font-bold text-lg">✓</div>
            <div>
              <p className="text-sm font-medium text-gray-800">Message sent!</p>
              <p className="text-xs text-gray-500">We’ll get back to you soon.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactUs;
