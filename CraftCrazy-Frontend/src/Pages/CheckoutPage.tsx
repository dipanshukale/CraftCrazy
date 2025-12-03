import React, { useState, useEffect } from "react";
import { useCart } from "../AuthContext/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../utils/apiConfig";

interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  customization?: string;
}

interface IOrder {
  emailOrPhone: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
  customization?: string;
  paymentMethod: string;
  items?: IOrderItem[];
  totalAmount?: number;
  createdAt?: Date;
}

const CheckoutPage: React.FC = () => {
  const { cart, clearCart, updateCartItem } = useCart();
  const navigate = useNavigate();
  const shippingCharges = 1;

  const initialFormData: IOrder = {
    emailOrPhone: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    customization: "",
    paymentMethod: "",
  };

  const [formData, setFormData] = useState<IOrder>(initialFormData);
  const [toast, setToast] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const token = localStorage.getItem("token");

  // Load Razorpay script dynamically
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (cart.length > 0) {
      setFormData((prev) => ({
        ...prev,
        customization: cart.map((item) => item.customization || "").join("; "),
      }));
    }
  }, [cart]);

  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getAuthConfig = () =>
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : undefined;

  const handleRazorpayPayment = async (amount: number) => {
    setLoading(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setToast("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    try {
      // create order on backend
      const isEmailInput = formData.emailOrPhone.includes("@");

      const { data } = await axios.post(
        getApiUrl("api/order/createOrder"),
        {
          customer: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: isEmailInput ? formData.emailOrPhone : undefined,
            contact: formData.phone || formData.emailOrPhone,
            address: formData.address,
            apartment: formData.apartment,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
          },
          items: cart.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            customization: item.customization?.userInput || "",
          })),
          totalAmount: amount,
          paymentMethod: formData.paymentMethod,
        },
        getAuthConfig()
      );

      // Always use the key coming from backend (which reads live env vars).
      // This avoids accidentally falling back to any test key in frontend env.
      const publicKey = import.meta.env.VITE_RAZORPAY_KEY;
      console.log("Razorpay key used:", publicKey);
      if (!data.orderId || !data.orderDBId || !publicKey) {
        console.log("Razorpay order initialization info missing.", data);
        setToast("Unable to initiate payment. Please try again later.");
        setLoading(false);
        return;
      }

      const options = {
        key: publicKey,
        amount: data.amount || amount * 100,
        currency: data.currency || "INR",
        name: "CraftiCrazy",
        description: "Order Payment",
        order_id: data.orderId, // Razorpay order ID from backend
        handler: async function (response: any) {
          try {
            await axios.post(
              getApiUrl("api/order/orderComplete"),
              {
                orderDBId: data.orderDBId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              },
              getAuthConfig()
            );
            setToast("Payment successful!");
            clearCart();
            setFormData(initialFormData);
            navigate("/success", { state: { message: "Your order has been placed successfully!" } });
          } catch (err) {
            console.error(err);
            setToast("Payment succeeded but confirmation failed. Contact support.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.emailOrPhone.includes("@") ? formData.emailOrPhone : "",
          contact: formData.phone || formData.emailOrPhone,
        },
        theme: { color: "#5b2232" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", async (response: any) => {
        try {
          await axios.post(
            getApiUrl("api/order/orderFailed"),
            {
              orderDBId: data.orderDBId,
              reason: response.error?.description || response.error?.reason || "Payment failed",
            },
            getAuthConfig()
          );
        } catch (failureError) {
          console.error(failureError);
        } finally {
          setToast(response.error?.description || "Payment failed. Please try again.");
          setLoading(false);
        }
      });
      rzp.open();
    } catch (err: any) {
      console.error(err);
      setToast(err.response?.data?.message || "Payment initiation failed. Please try again.");
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const value = formData.emailOrPhone.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isPhone = /^[0-9]{10}$/.test(value);

    if (!isEmail && !isPhone) {
      setToast("Please enter a valid email or 10-digit phone number.");
      return;
    }

    if (!formData.paymentMethod) {
      setToast("Please select a payment method.");
      return;
    }

    if (cart.length === 0) {
      setToast("Your cart is empty.");
      return;
    }

    cart.forEach((item) => {
      updateCartItem(item.id, {
        ...item,
        customization: {
          available: !!formData.customization,
          userInput: formData.customization || "",
        },
      });
    });

    const amount = totalPrice + shippingCharges;

    if (formData.paymentMethod === "UPI") {
      handleRazorpayPayment(amount);
    } else {
      // for future implementation of COD
      setToast("Order placed successfully! Cash on Delivery selected.");
      clearCart();
      setFormData(initialFormData);
      navigate("/success", { state: { message: "Your order is confirmed!" } });
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdf7] py-6 px-4 sm:px-6 lg:px-12">
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-20">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png"
            alt="Empty Cart"
            className="w-40 h-40 mb-6 animate-bounce"
          />
          <h2 className="text-2xl sm:text-3xl font-bold text-[#5b2232] mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-6 max-w-sm">
            Looks like you haven't added anything to your cart yet. Start shopping now and fill
            your cart with amazing products!
          </p>
          <Link
            to="/newarrivals"
            className="bg-[#5b2232] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#451a27] transition duration-200"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Left Form Section */}
          <form
            onSubmit={handleSubmit}
            className="w-full lg:w-2/3 bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col gap-4"
          >
            {/* Contact */}
            <h2 className="text-lg sm:text-xl font-semibold text-[#5b2232] mb-2">Contact</h2>
            <input
              type="text"
              name="emailOrPhone"
              value={formData.emailOrPhone || ""}
              onChange={handleChange}
              required
              placeholder="Email or mobile number"
              className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-[#5b2232] outline-none"
            />

            {/* Delivery */}
            <h2 className="text-lg sm:text-xl font-semibold text-[#5b2232] mb-2">Delivery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                name="firstName"
                value={formData.firstName || ""}
                onChange={handleChange}
                required
                placeholder="First name"
                className="border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-[#5b2232] outline-none"
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleChange}
                required
                placeholder="Last name"
                className="border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-[#5b2232] outline-none"
              />
            </div>

            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              required
              placeholder="Address"
              className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-[#5b2232] outline-none"
            />
            <input
              type="text"
              name="apartment"
              value={formData.apartment || ""}
              onChange={handleChange}
              placeholder="Apartment, suite, etc."
              className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-[#5b2232] outline-none"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
                required
                placeholder="City"
                className="border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-[#5b2232] outline-none"
              />
              <input
                type="text"
                name="state"
                value={formData.state || ""}
                onChange={handleChange}
                required
                placeholder="State"
                className="border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-[#5b2232] outline-none"
              />
              <input
                type="text"
                name="pincode"
                value={formData.pincode || ""}
                onChange={handleChange}
                required
                placeholder="PIN code"
                className="border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-[#5b2232] outline-none"
              />
            </div>

            <input
              type="tel"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              required
              placeholder="Phone number"
              className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-[#5b2232] outline-none"
            />

            {/* Customization */}
            {/* <h2 className="text-lg sm:text-xl font-semibold text-[#5b2232] mb-2">Customization</h2>
            <textarea
              name="customization"
              value={formData.customization || ""}
              onChange={handleChange}
              placeholder="Write if you want to customize your hamper or product..."
              className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-[#5b2232] outline-none"
              rows={3}
            /> */}

            {/* Payment */}
            <h2 className="text-lg sm:text-xl font-semibold text-[#5b2232] mb-2">Payment</h2>
            <div className="border border-gray-300 rounded-md p-4 mb-4 space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="UPI"
                  checked={formData.paymentMethod === "UPI"}
                  onChange={handleChange}
                  className="text-[#5b2232]"
                />
                <span className="text-sm text-gray-700">Card / UPI / Netbanking</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#5b2232] cursor-pointer text-white font-semibold rounded-md hover:bg-[#451a27] transition duration-200"
            >
              {isLoading ? "Processing Payment..." : "Pay Now"}
            </button>
          </form>

          {/* Right Summary */}
          <div className="w-full lg:w-1/3 bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 mt-6 lg:mt-0">
            <h2 className="text-lg sm:text-xl font-semibold text-[#5b2232] mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-[26rem] overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex flex-col gap-1 border-b pb-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || "https://via.placeholder.com/80"}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-md border"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#3c1f2c]">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <p className="font-semibold text-[#5b2232]">
                      ₹{Number(item.price) * Number(item.quantity)}
                    </p>
                  </div>

                  {item.customization && (
                    <p className="text-xs text-gray-600 italic ml-4">💡 {item.customization.userInput}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 border-t pt-3 space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shippingCharges}</span>
              </div>
              <div className="flex justify-between font-semibold text-[#5b2232] text-base">
                <span>Total</span>
                <span>₹{totalPrice + shippingCharges}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Message */}
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

export default CheckoutPage;
