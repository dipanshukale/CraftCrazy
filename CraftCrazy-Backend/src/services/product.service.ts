import { Product, IProduct } from "../models/product.model";
import User from "../models/user.model";
import { getIO } from "../socket/initSocket";
import { formatText, toTitleCase, normalizeCategory } from "../utils/normalize";

export const createProductService = async (data: IProduct) => {
  // Handle tags properly
  let tags: string[] = [];

  if (Array.isArray(data.tags)) {
    tags = data.tags.map((t: string) => t.trim().toLowerCase());
  } else if (typeof data.tags === "string") {
    tags = data.tags.toLowerCase().split(",").map(t => t.trim());
  }

  const formattedData = {
    ...data,
    name: toTitleCase(data.name),
    description: data.description ? formatText(data.description) : "",
    highlight: data.highlight ? formatText(data.highlight) : "",
    category: normalizeCategory(data.category),
    brand: data.brand ? toTitleCase(data.brand) : "",
    seller: data.seller ? toTitleCase(data.seller) : "",
    occasion: data.occasion ? toTitleCase(data.occasion) : "",
    material: data.material ? toTitleCase(data.material) : "",
    returnPolicy: data.returnPolicy ? formatText(data.returnPolicy) : "",
    warranty: data.warranty?.trim(),
    tags,
    price: Number(data.price),
    rating: data.rating ? Number(data.rating) : 0,
    reviews: data.reviews ? Number(data.reviews) : 0,
  };

  const newProduct = new Product(formattedData);
  return await newProduct.save();
};

// Get all products
export const getAllProductsService = async () => {
  return await Product.find().sort({ createdAt: -1 });
};


export const getProductsByCategoryService = async (category: string) => {
  const query: any = {};

  if (category) {
    query.category = { $regex: new RegExp(`^${category}$`, "i") }; // case-insensitive match
  }

  return await Product.find(query).sort({ createdAt: -1 });
};

export const getProductByIdService = async (id: string) => {
  return await Product.findById(id);
};

export const updateProductService = async (id: string, data: Partial<IProduct>) => {
  return await Product.findByIdAndUpdate(id, data, { new: true });
};

export const deleteProductService = async (id: string) => {
  return await Product.findByIdAndDelete(id);
};

export const searchService = async (query: string) => {
  const products = await Product.find({
    name: { $regex: query, $options: "i" }
  }).select("_id name category price");

  const users = await User.find({
    name: { $regex: query, $options: "i" }
  }).select("_id name role email");

  getIO().emit("searching");

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
