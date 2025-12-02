"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllReviewsController = exports.deleteReviewController = exports.getReviewsByProductController = exports.addReviewController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Review_model_1 = __importDefault(require("../models/Review.model"));
const reviewServices = __importStar(require("../services/review.service"));
const addReviewController = async (req, res) => {
    try {
        const { productId, variantId, name, email, title, comment, rating } = req.body;
        if (!productId || !name || !comment || !rating) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const review = new Review_model_1.default({
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
    }
    catch (error) {
        res.status(500).json({ message: "Failed to add review", error: error.message });
    }
};
exports.addReviewController = addReviewController;
const getReviewsByProductController = async (req, res) => {
    try {
        const productId = req.params.id;
        const limit = parseInt(req.query.limit) || 10;
        if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }
        // Fetch Reviews
        const reviews = await Review_model_1.default.find({ productId })
            .sort({ date: -1 })
            .limit(limit);
        const reviewCount = await Review_model_1.default.countDocuments({ productId });
        // Average Rating
        const avgResult = await Review_model_1.default.aggregate([
            { $match: { productId: new mongoose_1.default.Types.ObjectId(productId) } },
            { $group: { _id: "$productId", avgRating: { $avg: "$rating" } } },
        ]);
        const averageRating = avgResult.length > 0
            ? Number(avgResult[0].avgRating.toFixed(1))
            : 0;
        res.status(200).json({ reviews, reviewCount, averageRating });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
    }
};
exports.getReviewsByProductController = getReviewsByProductController;
// Delete review by ID
const deleteReviewController = async (req, res) => {
    try {
        const reviewId = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).json({ message: "Invalid review ID" });
        }
        await Review_model_1.default.findByIdAndDelete(reviewId);
        res.json({ message: "Review deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete review", error: error.message });
    }
};
exports.deleteReviewController = deleteReviewController;
const getAllReviewsController = async (req, res) => {
    try {
        const reviews = await reviewServices.getAllReviewsService();
        res.status(200).json({ success: true, reviews });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.getAllReviewsController = getAllReviewsController;
