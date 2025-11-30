// src/Components/CustomerReview.tsx
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

export interface Review {
  _id?: string;
  name: string;
  email?: string;
  title?: string;
  comment: string;
  rating: number;
  image?: string;
  date: string;
}

interface CustomerReviewProps {
  productId: string;
  variantId?: string;
  setBackendRating?: (rating: number) => void;
  setBackendReviewsCount?: (count: number) => void;
}

export default function CustomerReview({
  productId,
  variantId,
  setBackendRating,
  setBackendReviewsCount,
}: CustomerReviewProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    if (!productId) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}api/reviews/product/${productId}?limit=8`
      );
      if (!res.ok) throw new Error("Reviews fetch failed");
      const data = await res.json();

      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      setBackendRating?.(data.averageRating ?? 0);
      setBackendReviewsCount?.(data.reviewCount ?? 0);
    } catch (err) {
      console.error(err);
      setReviews([]);
      setBackendRating?.(0);
      setBackendReviewsCount?.(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, variantId]);

  if (loading)
    return <p className="text-gray-500 mt-4 text-center">Loading reviews...</p>;

  if (!reviews.length)
    return <p className="text-gray-500 mt-4 text-center">No reviews yet.</p>;

  return (
    <div className="mt-8 max-w-3xl mx-auto px-4">
      <h2 className="text-xl md:text-3xl font-bold mb-6 text-gray-900">
        Customer Reviews ({reviews.length})
      </h2>

      <div className="flex flex-col gap-6">
        {reviews.map((review) => (
          <motion.div
            key={review._id}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                {review.image ? (
                  <img
                    src={review.image}
                    alt={review.name}
                     loading="lazy" 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                    {review.name?.charAt(0)}
                  </div>
                )}

                <div>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">
                    {review.name}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* ⭐ Rating */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const filled = review.rating >= i + 1;
                  const halfFilled = review.rating > i && review.rating < i + 1;

                  return (
                    <Star
                      key={i}
                      size={18}
                      className={
                        filled
                          ? "fill-yellow-400 text-yellow-400"
                          : halfFilled
                            ? "fill-yellow-300 text-yellow-300"
                            : "text-gray-300"
                      }
                    />
                  );
                })}
              </div>
            </div>

            {review.title && (
              <p className="font-semibold text-gray-900 mt-3 text-base sm:text-lg">
                {review.title}
              </p>
            )}

            <p className="text-gray-700 mt-2 leading-relaxed text-sm sm:text-base">
              {review.comment}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
