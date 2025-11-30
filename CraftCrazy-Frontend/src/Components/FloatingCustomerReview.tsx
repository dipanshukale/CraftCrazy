// src/Components/FloatingCustomerReview.tsx
import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";

export interface Review {
  _id?: string;
  name: string;
  email?: string;
  title?: string;
  comment: string;
  rating: number;
  date: string;
}

interface LocalReview extends Review {
  productId: string;
  variantId?: string;
}

interface FloatingCustomerReviewProps {
  productId: string;
  variantId?: string;
  onReviewSubmitted?: () => void;
}

const FloatingCustomerReview: React.FC<FloatingCustomerReviewProps> = ({
  productId,
  variantId,
  onReviewSubmitted,
}) => {
  const { isAuthenticated, user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi! I'm your Review Assistant." },
    { sender: "bot", text: "Would you like to share your experience? (yes/no)" }
  ]);

  const [review, setReview] = useState<LocalReview>({
    productId,
    variantId,
    name: user?.name || "",
    email: user?.email || "",
    title: "",
    comment: "",
    rating: 0,
    date: new Date().toISOString(),
  });

  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const [customToast, setCustomToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setCustomToast(msg);
    setTimeout(() => setCustomToast(null), 2000);
  };

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const submitReviewToBackend = async () => {
    try {
      const reviewPayload = { ...review, rating: Number(review.rating) };

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}api/reviews/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewPayload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to submit review.");

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "🎉 Thank you! Your review is submitted." },
        { sender: "bot", text: "🔄 Please refresh to see your review live." },
      ]);

      setStep(7);

      setTimeout(() => {
        setIsOpen(false);
        onReviewSubmitted?.();
      }, 1500);
    } catch (error) {
      console.error(error);
      showToast("Something went wrong.");
    }
  };

  const handleSend = () => {
    if (!isAuthenticated) {
      showToast("Please login to submit a review.");
      setIsOpen(false);
      return;
    }

    if (!input.trim()) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInput("");

    setTimeout(() => handleBotFlow(userText.toLowerCase()), 1200);
  };

  const handleBotFlow = async (text: string) => {
    switch (step) {
      case 0:
        if (text === "yes") {
          setMessages((p) => [...p, { sender: "bot", text: "Great! What's your name?" }]);
          setStep(1);
        } else if (text === "no") {
          setMessages((p) => [...p, { sender: "bot", text: "No problem! Have a great day 💛" }]);
          setTimeout(() => setIsOpen(false), 1000);
        } else {
          setMessages((p) => [...p, { sender: "bot", text: "Please type 'yes' or 'no'." }]);
        }
        break;

      case 1:
        setReview((r) => ({ ...r, name: text }));
        setMessages((p) => [...p, { sender: "bot", text: "Nice! What's your email?" }]);
        setStep(2);
        break;

      case 2:
        setReview((r) => ({ ...r, email: text }));
        setMessages((p) => [...p, { sender: "bot", text: "Give your review a short title:" }]);
        setStep(3);
        break;

      case 3:
        setReview((r) => ({ ...r, title: text }));
        setMessages((p) => [...p, { sender: "bot", text: "Now type your full review:" }]);
        setStep(4);
        break;

      case 4:
        setReview((r) => ({ ...r, comment: text }));
        setMessages((p) => [
          ...p,
          { sender: "bot", text: "Rate your experience by clicking stars 👇 (0.5 to 5⭐)" }
        ]);
        setStep(5);
        break;

      case 6:
        if (text === "submit") {
          await submitReviewToBackend();
        } else {
          setMessages((p) => [...p, { sender: "bot", text: "Type 'submit' when ready." }]);
        }
        break;

      default:
        break;
    }
  };

  return (
    <>
      <motion.button
        onClick={() => {
          if (!isAuthenticated) {
            showToast("Please login to submit a review.");
            return;
          }
          setIsOpen(!isOpen);
        }}
        className="fixed bottom-6 right-6 bg-[#b46029] text-white p-4 rounded-full shadow-lg z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-20 right-6 w-80 bg-white border shadow-xl rounded-2xl overflow-hidden z-50"
          >
            <div className="bg-gray-100 p-3 text-center font-semibold">🧡 Review Assistant</div>

            <div ref={chatRef} className="p-3 max-h-96 overflow-y-auto space-y-2 scrollbar-thin">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg max-w-[80%] ${
                    msg.sender === "bot"
                      ? "bg-gray-200 text-black"
                      : "bg-[#b46029] text-white ml-auto"
                  }`}
                >
                  {msg.text}
                </div>
              ))}

              {step === 5 && (
                <div className="flex flex-wrap items-center justify-center gap-1 py-2">
                  {[0.5,1,1.5,2,2.5,3,3.5,4,4.5,5].map((value) => (
                    <span
                      key={value}
                      onClick={() => {
                        setReview((r) => ({ ...r, rating: value }));
                        setMessages((p) => [
                          ...p,
                          { sender: "bot", text: `You rated ${value} ⭐` },
                          { sender: "bot", text: "Type 'submit' when ready." }
                        ]);
                        setStep(6);
                      }}
                      className="cursor-pointer text-yellow-500 text-xl hover:scale-125 transition-transform"
                    >
                      {value % 1 !== 0 ? "⭐½" : "⭐"}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 p-2 border-t">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type..."
                className="flex-1 border rounded-lg px-2 py-1 text-sm"
              />
              <button onClick={handleSend} className="bg-[#b46029] text-white px-3 py-2 rounded-lg">
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {customToast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#E8D4B7] px-6 py-3 rounded-lg shadow-lg"
        >
          {customToast}
        </motion.div>
      )}
    </>
  );
};

export default FloatingCustomerReview;
