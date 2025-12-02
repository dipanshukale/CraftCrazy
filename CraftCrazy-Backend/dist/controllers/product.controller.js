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
exports.searchController = exports.getProductsByCategoryController = exports.deleteProductController = exports.updateProductController = exports.getProductByIdController = exports.getAllProdutsController = exports.createProductController = exports.uploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("../utils/cloudinary");
const productService = __importStar(require("../services/product.service"));
const storage = multer_1.default.memoryStorage();
exports.uploadMiddleware = (0, multer_1.default)({ storage }).single("image");
const createProductController = async (req, res, next) => {
    try {
        let { ...data } = req.body;
        let imageUrl = req.body?.imageUrl || null;
        if (!req.file && !imageUrl) {
            return res.status(400).json({ message: "Image file or URL is required" });
        }
        if (req.file) {
            const upload = await (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, "Craftcrazy-products");
            imageUrl = upload.secure_url;
        }
        const product = await productService.createProductService({
            ...data,
            imageUrl
        });
        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product,
        });
    }
    catch (error) {
        console.log("CREATE PRODUCT ERROR:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
exports.createProductController = createProductController;
const getAllProdutsController = async (req, res, next) => {
    try {
        const allProudcts = await productService.getAllProductsService();
        res.status(200).json({ allProudcts });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllProdutsController = getAllProdutsController;
// Get Product By ID
const getProductByIdController = async (req, res, next) => {
    try {
        const product = await productService.getProductByIdService(req.params.id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ product });
    }
    catch (error) {
        next(error);
    }
};
exports.getProductByIdController = getProductByIdController;
//  Update Product
const updateProductController = async (req, res, next) => {
    try {
        const { id } = req.params;
        let updateData = req.body;
        if (req.file) {
            const cloudinaryResult = await (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, "products");
            updateData.imageUrl = cloudinaryResult.secure_url;
        }
        const updatedProduct = await productService.updateProductService(id, updateData);
        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProductController = updateProductController;
// Delete Product
const deleteProductController = async (req, res, next) => {
    try {
        await productService.deleteProductService(req.params.id);
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProductController = deleteProductController;
const getProductsByCategoryController = async (req, res) => {
    try {
        console.log("category api is running...");
        const { category } = req.query;
        const products = await productService.getProductsByCategoryService(category);
        console.log("category api is running 2");
        res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to load products",
            error
        });
    }
};
exports.getProductsByCategoryController = getProductsByCategoryController;
const searchController = async (req, res) => {
    try {
        // Extract query
        let q = req.query.q;
        // Normalize to a string
        if (Array.isArray(q)) {
            q = q[0]; // If multiple values, take first
        }
        if (typeof q !== "string") {
            q = ""; // Ensure q is ALWAYS a string
        }
        // Validate trimmed value
        const queryString = q.trim();
        if (!queryString) {
            return res.json([]);
        }
        const results = await productService.searchService(queryString);
        return res.status(200).json(results);
    }
    catch (error) {
        console.error("Search Error:", error);
        return res.status(500).json({ message: "Search failed", error });
    }
};
exports.searchController = searchController;
