// src/Pages/Cart.tsx
import React, { useState, useEffect } from "react";
import { useCart } from "../AuthContext/CartContext";
import { Trash2, Plus, Minus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

interface CartSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Cart: React.FC<CartSidebarProps> = ({ isOpen, setIsOpen }) => {
  const { cart, removeFromCart, increaseQty, decreaseQty, updateCartItem } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );
  const shippingCharge = subtotal > 0 ? 1 : 0;
  const total = subtotal + shippingCharge;

  // Collapse sidebar when closing
  useEffect(() => {
    if (!isOpen) {
      const timeout = setTimeout(() => setIsExpanded(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Scroll to top when cart opens
  useEffect(() => {
    if (isOpen) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isOpen]);

  // Focus first customization input when cart opens
  useEffect(() => {
    if (isOpen) {
      const firstInput = document.querySelector<HTMLInputElement>(
        'input[placeholder="Enter your customization..."]'
      );
      firstInput?.focus();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 z-50 flex justify-end sm:justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
        >
          {/* Sidebar */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 120 }}
            className={`w-full sm:w-[400px] bg-white h-full shadow-2xl flex flex-col relative`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-2 border-b border-gray-200 sticky top-0 bg-white z-50">
              <h2 className="text-xl font-bold text-gray-800">Cart</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5 text-gray-600 hover:text-red-500" />
              </button>
            </div>

            {/* Cart Items */}
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-600 px-5 mt-10 overflow-y-auto">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png"
                  alt="Empty Cart"
                  className="w-32 h-32 mb-4 animate-bounce"
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Your cart is empty!</h3>
                <p className="text-center text-gray-500 mb-4">
                  Looks like you haven't added anything yet. Let's get some amazing products!
                </p>
                <Link
                  to="/newarrivals"
                  className="bg-[#4B0E23] hover:bg-[#65102E] text-white font-semibold px-5 py-2 rounded-full transition flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  🛒 Shop Now
                </Link>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between overflow-y-auto">
                <div className="p-4 space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-start justify-between border-b pb-3">
                      <div className="flex items-start gap-3 w-full">
                        <img
                          src={item.image}
                          alt={item.name}
                           loading="lazy" 
                          className="w-16 h-16 rounded-lg object-cover border"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 text-sm">{item.name}</h3>
                          <p className="text-gray-600 text-sm mt-1">
                            ₹{item.price} x {item.quantity}
                          </p>

                          <div className="flex items-center mt-2 gap-2">
                            <button
                              onClick={() => decreaseQty(item.id)}
                              className="px-2 py-1 rounded border border-gray-300 cursor-pointer"
                            >
                              <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="px-2 text-gray-800">{item.quantity}</span>
                            <button
                              onClick={() => increaseQty(item.id)}
                              className="px-2 py-1 rounded border border-gray-300 cursor-pointer"
                            >
                              <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>

                          <div className="mt-2">
                            <label className="block text-sm text-gray-700 mb-1">
                              Special Instructions:
                            </label>
                            <input
                              type="text"
                              placeholder="Enter your customization..."
                              className="w-full px-2 py-1 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#4B0E23]"
                              value={item.customization?.userInput || ""}
                              onChange={(e) =>
                                updateCartItem(item.id, {
                                  ...item,
                                  customization: {
                                    available: true,
                                    userInput: e.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition ml-2"
                      >
                        <Trash2 className="w-5 h-5 cursor-pointer" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Sticky Summary */}
                <div className="w-full bg-white p-4 border-t border-gray-200">
                  <div className="flex justify-between mb-1 text-gray-700 text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-1 text-gray-700 text-sm">
                    <span>Shipping</span>
                    <span>₹{shippingCharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-[#4B0E23] text-base">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>

                  <div className="mt-3 flex flex-col gap-2">
                    <Link
                      to="/checkout"
                      className="w-full py-2 text-center bg-[#4B0E23] text-white font-semibold rounded-full text-sm hover:bg-[#65102E] transition"
                      onClick={() => setIsOpen(false)}
                    >
                      Checkout
                    </Link>
                    <Link
                      to="/newarrivals"
                      className="w-full py-2 text-center border border-[#4B0E23] text-[#4B0E23] font-semibold rounded-full text-sm hover:bg-[#4B0E23]/10 transition"
                      onClick={() => setIsOpen(false)}
                    >
                      Continue Shopping
                    </Link>
                  </div>

                  <p className="text-xs text-gray-500 text-center mt-2">
                    🔒 Guaranteed secure & safe checkout.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Cart;
