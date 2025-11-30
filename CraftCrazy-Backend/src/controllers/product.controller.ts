import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { uploadToCloudinary } from "../utils/cloudinary";
import * as productService from "../services/product.service";

const storage = multer.memoryStorage();
export const uploadMiddleware = multer({ storage }).single("image");
export const createProductController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { ...data } = req.body;
    let imageUrl: string | null = req.body?.imageUrl || null;

    if (!req.file && !imageUrl) {
      return res.status(400).json({ message: "Image file or URL is required" });
    }

    if (req.file) {
      const upload: any = await uploadToCloudinary(req.file.buffer, "Craftcrazy-products");
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

  } catch (error) {
    console.log("CREATE PRODUCT ERROR:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllProdutsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allProudcts = await productService.getAllProductsService();
    res.status(200).json({ allProudcts });
  } catch (error) {
    next(error);
  }
}

// Get Product By ID
export const getProductByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getProductByIdService(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
};

//  Update Product
export const updateProductController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    let updateData = req.body;

    if (req.file) {
      const cloudinaryResult: any = await uploadToCloudinary(req.file.buffer, "products");
      updateData.imageUrl = cloudinaryResult.secure_url;
    }

    const updatedProduct = await productService.updateProductService(id, updateData);

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    next(error);
  }
};

// Delete Product
export const deleteProductController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await productService.deleteProductService(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getProductsByCategoryController = async (req: Request, res: Response) => {
  try {
    console.log("category api is running...")
    const { category } = req.query;
    const products = await productService.getProductsByCategoryService(category as string);

    console.log("category api is running 2");
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load products",
      error
    });
  }
};

export const searchController = async (req: Request, res: Response) => {
  try {
    // Extract query
    let q = req.query.q;

    // Normalize to a string
    if (Array.isArray(q)) {
      q = q[0];   // If multiple values, take first
    }

    if (typeof q !== "string") {
      q = "";     // Ensure q is ALWAYS a string
    }

    // Validate trimmed value
    const queryString = q.trim();

    if (!queryString) {
      return res.json([]);  
    }

    const results = await productService.searchService(queryString);
    return res.status(200).json(results);

  } catch (error) {
    console.error("Search Error:", error);
    return res.status(500).json({ message: "Search failed", error });
  }
};
