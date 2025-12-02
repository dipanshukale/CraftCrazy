"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllReviewsService = exports.deleteReviewService = exports.getReviewsByProductService = exports.addReviewService = void 0;
const Review_model_1 = __importDefault(require("../models/Review.model"));
// Add a new review
const addReviewService = async (data) => {
    const review = new Review_model_1.default(data);
    return await review.save();
};
exports.addReviewService = addReviewService;
// Get reviews by product with optional limit (default 8)
const getReviewsByProductService = async (productId, limit = 8) => {
    return await Review_model_1.default.find({ productId })
        .sort({ date: -1 })
        .limit(limit);
};
exports.getReviewsByProductService = getReviewsByProductService;
// Delete a review by ID
const deleteReviewService = async (reviewId) => {
    return await Review_model_1.default.findByIdAndDelete(reviewId);
};
exports.deleteReviewService = deleteReviewService;
const getAllReviewsService = async () => {
    return await Review_model_1.default.find().sort({ date: -1 });
};
exports.getAllReviewsService = getAllReviewsService;
