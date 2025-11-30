import { Request, Response } from "express";
import mongoose from "mongoose";
import Review from "../models/Review.model";
import * as reviewServices from "../services/review.service"

export const addReviewController = async (req: Request, res: Response) => {
  try {
    const { productId, variantId, name, email, title, comment, rating } = req.body;

    if (!productId || !name || !comment || !rating) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const review = new Review({
      productId,
      variantId,
      name,
      email,
      title,
      comment,
      rating: Number(rating),
      date: new Date(),
    });

    await review.save();
    res.status(201).json({ message: "Review added successfully", review });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to add review", error: error.message });
  }
};

export const getReviewsByProductController = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Fetch Reviews
    const reviews = await Review.find({ productId })
      .sort({ date: -1 })
      .limit(limit);

    const reviewCount = await Review.countDocuments({ productId });

    // Average Rating
    const avgResult = await Review.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      { $group: { _id: "$productId", avgRating: { $avg: "$rating" } } },
    ]);

    const averageRating = avgResult.length > 0 
      ? Number(avgResult[0].avgRating.toFixed(1)) 
      : 0;

    res.status(200).json({ reviews, reviewCount, averageRating });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch reviews", error: (error as Error).message });
  }
};

// Delete review by ID
export const deleteReviewController = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    await Review.findByIdAndDelete(reviewId);
    res.json({ message: "Review deleted successfully" });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete review", error: (error as Error).message });
  }
};

export const getAllReviewsController = async (req: Request, res: Response) => {
  try {
    const reviews = await reviewServices.getAllReviewsService();
    res.status(200).json({ success: true, reviews });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
