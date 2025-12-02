"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchService = exports.deleteProductService = exports.updateProductService = exports.getProductByIdService = exports.getProductsByCategoryService = exports.getAllProductsService = exports.createProductService = void 0;
const product_model_1 = require("../models/product.model");
const user_model_1 = __importDefault(require("../models/user.model"));
const initSocket_1 = require("../socket/initSocket");
const normalize_1 = require("../utils/normalize");
const createProductService = async (data) => {
    // Handle tags properly
    let tags = [];
    if (Array.isArray(data.tags)) {
        tags = data.tags.map((t) => t.trim().toLowerCase());
    }
    else if (typeof data.tags === "string") {
        tags = data.tags.toLowerCase().split(",").map(t => t.trim());
    }
    const formattedData = {
        ...data,
        name: (0, normalize_1.toTitleCase)(data.name),
        description: data.description ? (0, normalize_1.formatText)(data.description) : "",
        highlight: data.highlight ? (0, normalize_1.formatText)(data.highlight) : "",
        category: (0, normalize_1.normalizeCategory)(data.category),
        brand: data.brand ? (0, normalize_1.toTitleCase)(data.brand) : "",
        seller: data.seller ? (0, normalize_1.toTitleCase)(data.seller) : "",
        occasion: data.occasion ? (0, normalize_1.toTitleCase)(data.occasion) : "",
        material: data.material ? (0, normalize_1.toTitleCase)(data.material) : "",
        returnPolicy: data.returnPolicy ? (0, normalize_1.formatText)(data.returnPolicy) : "",
        warranty: data.warranty?.trim(),
        tags,
        price: Number(data.price),
        rating: data.rating ? Number(data.rating) : 0,
        reviews: data.reviews ? Number(data.reviews) : 0,
    };
    const newProduct = new product_model_1.Product(formattedData);
    return await newProduct.save();
};
exports.createProductService = createProductService;
// Get all products
const getAllProductsService = async () => {
    return await product_model_1.Product.find().sort({ createdAt: -1 });
};
exports.getAllProductsService = getAllProductsService;
const getProductsByCategoryService = async (category) => {
    const query = {};
    if (category) {
        query.category = { $regex: new RegExp(`^${category}$`, "i") }; // case-insensitive match
    }
    return await product_model_1.Product.find(query).sort({ createdAt: -1 });
};
exports.getProductsByCategoryService = getProductsByCategoryService;
const getProductByIdService = async (id) => {
    return await product_model_1.Product.findById(id);
};
exports.getProductByIdService = getProductByIdService;
const updateProductService = async (id, data) => {
    return await product_model_1.Product.findByIdAndUpdate(id, data, { new: true });
};
exports.updateProductService = updateProductService;
const deleteProductService = async (id) => {
    return await product_model_1.Product.findByIdAndDelete(id);
};
exports.deleteProductService = deleteProductService;
const searchService = async (query) => {
    const products = await product_model_1.Product.find({
        name: { $regex: query, $options: "i" }
    }).select("_id name category price");
    const users = await user_model_1.default.find({
        name: { $regex: query, $options: "i" }
    }).select("_id name role email");
    (0, initSocket_1.getIO)().emit("searching");
    return [
        ...products.map(p => ({
            type: "Product",
            ...p.toObject()
        })),
        ...users.map(u => ({
            type: "User",
            ...u.toObject()
        }))
    ];
};
exports.searchService = searchService;
