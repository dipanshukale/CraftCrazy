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
exports.demandOrders = exports.createDemandController = exports.uploadMiddleware = void 0;
const demandService = __importStar(require("../services/demand.service"));
const cloudinary_1 = require("../utils/cloudinary");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
exports.uploadMiddleware = (0, multer_1.default)({ storage }).single("image");
const createDemandController = async (req, res) => {
    try {
        const { name, email, phone, product, customization } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }
        const cloudinaryResult = await (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, "demands");
        const newDemand = await demandService.createDemandService({
            name,
            email,
            phone,
            product,
            customization,
            imageUrl: cloudinaryResult.secure_url,
        });
        res.status(201).json({
            message: "Demand created successfully",
            demand: newDemand,
        });
    }
    catch (error) {
        console.error("Cloudinary Upload Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.createDemandController = createDemandController;
const demandOrders = async (req, res, next) => {
    try {
        const allDemandOrders = await demandService.getAllDemandService();
        res.status(200).json({ message: "All customized Orders", customizedOrder: allDemandOrders });
    }
    catch (error) {
        next(error);
    }
};
exports.demandOrders = demandOrders;
