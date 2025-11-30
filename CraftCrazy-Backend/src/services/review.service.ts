import Review, { IReview } from "../models/Review.model";

// Add a new review
export const addReviewService = async (data: IReview) => {
  const review = new Review(data);
  return await review.save();
};

// Get reviews by product with optional limit (default 8)
export const getReviewsByProductService = async (productId: string, limit = 8) => {
  return await Review.find({ productId })
    .sort({ date: -1 })
    .limit(limit);
};

// Delete a review by ID
export const deleteReviewService = async (reviewId: string) => {
  return await Review.findByIdAndDelete(reviewId);
};

export const getAllReviewsService = async () => {
  return await Review.find().sort({ date: -1 });
};

