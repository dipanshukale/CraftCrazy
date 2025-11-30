import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Quote, Star, Mail, MapPin, Phone, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
interface Review {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  comment: string;
  rating: number;
  date: string;
}

const randomAvatar = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=random&color=fff&bold=true&size=128&font-size=0.45`;

const CustomerReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("https://node-test-1-34fs.onrender.com/api/reviews/");
        const formattedReviews = res.data.reviews || res.data || [];
        setReviews(formattedReviews);
      } catch {
        console.warn("⚠️ API failed, using fallback reviews");
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const deleteReview = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this review? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      background: "#fff",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://node-test-1-34fs.onrender.com/api/reviews/${id}`);
          setReviews((prev) => prev.filter((r) => r._id !== id));

          Swal.fire({
            title: "Deleted!",
            text: "Review has been removed successfully.",
            icon: "success",
            timer: 1400,
            showConfirmButton: false,
          });
        } catch (err) {
          Swal.fire("Error", "Failed to delete review", "error");
        }
      }
    });
  };

  return (
    <motion.div className="p-6 bg-gray-50 min-h-screen" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2a0a4b]">⭐ Customer Reviews</h1>
          <p className="text-gray-500 mt-1">Feedback from our valuable customers and users.</p>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-500">No reviews found.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {reviews.map((r) => {
            const isExpanded = expanded === r._id;
            const shortText = r.comment.length > 120 ? r.comment.slice(0, 120) + "..." : r.comment;

            return (
              <motion.div
                key={r._id}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 250 }}
                className="relative bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-xl hover:border-[#845EF7]/60 transition-all duration-300"
              >
                {/* DELETE BUTTON */}
                <button
                  onClick={() => deleteReview(r._id)}
                  className="absolute bottom-3 right-3 cursor-pointer text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>

                <Quote className="absolute top-3 right-3 text-white bg-[#845EF7] rounded-full p-1 w-6 h-6 shadow-sm" />

                <div className="flex items-center gap-4 mb-3">
                  <img src={randomAvatar(r.name)} alt={r.name} className="w-12 h-12 rounded-full border-2 border-[#845EF7]/40" />
                  <div>
                    <h3 className="font-semibold text-[#4b0082]">{r.name}</h3>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                  {isExpanded ? r.comment : shortText}
                </p>
                {r.comment.length > 120 && (
                  <button onClick={() => setExpanded(isExpanded ? null : r._id)} className="text-[#845EF7] text-sm font-medium hover:underline">
                    {isExpanded ? "Show Less" : "Read More"}
                  </button>
                )}

                {/* Rating + Date */}
                <div className="flex items-center justify-between text-sm text-gray-600 mt-4">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Rating:</span>
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-4 h-4 ${
                          idx < Math.round(r.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-500">
                    {new Date(r.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600 space-y-1">
                  <p className="flex items-center gap-1"><Mail size={12} className="text-[#845EF7]" /> {r.email}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default CustomerReviewsPage;
