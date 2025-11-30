import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getApiUrl } from "../utils/apiConfig";


const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordMatch, setPasswordMatch] = useState(true);
  const [loading, setLoading] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Autofocus on name field
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "confirmPassword" || e.target.name === "password") {
      setPasswordMatch(
        e.target.name === "password"
          ? e.target.value === formData.confirmPassword
          : formData.password === e.target.value
      );
    }
  };

  // Handle signup
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordMatch) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(getApiUrl('api/auth/signup'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Account Created Successfully Please login ${data.user?.name}}!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
        navigate("/login");
      } else {
        toast.error("Invalid credentials ", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      }
    } catch (error) {
      console.error(error);
      alert("Server error! Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6">
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm sm:max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-xl"
      >
        {/* Logo */}
        <div className="flex justify-center mb-5">
          <img
            src="/Logo.jpeg"
            alt="CraftiCrazy Logo"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-contain shadow-md border-2 border-amber-400"
          />
        </div>

        {/* Title */}
        <div className="text-center mb-5">
          <h1 className="text-xl sm:text-2xl font-bold text-amber-600 flex items-center justify-center gap-2">
            <UserPlus className="w-6 h-6 sm:w-7 sm:h-7" /> Sign Up
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">
            Join <span className="font-semibold text-amber-700">CraftiCrazy</span> today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            ref={nameRef}
            required
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-xl text-sm sm:text-base focus:ring-2 ${
              passwordMatch ? "focus:ring-amber-500" : "focus:ring-red-500"
            } focus:outline-none`}
          />
          {!passwordMatch && formData.confirmPassword && (
            <p className="text-red-500 text-xs sm:text-sm">Passwords do not match!</p>
          )}
          {passwordMatch && formData.confirmPassword && (
            <p className="text-green-500 text-xs sm:text-sm">Password match!</p>
          )}

          <button
            type="submit"
            disabled={!passwordMatch || loading}
            className={`w-full py-2 sm:py-3 cursor-pointer bg-amber-600 text-white rounded-xl font-semibold shadow-md hover:bg-amber-700 transition text-sm sm:text-base ${
              !passwordMatch || loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs sm:text-sm text-center text-gray-600 mt-5">
          Already have an account?{" "}
          <a href="/login" className="text-amber-600 font-semibold hover:underline">
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUp;
