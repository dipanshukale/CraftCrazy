import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: string;
  rating?: string;
  reviews?: string;
  discount?: string;
  highlight?: string;
  category: string;
  tags?: string;
  brand?: string;
  seller?: string;
  inStock: boolean;
  warranty?: string;
  returnPolicy?: string;
  imageUrl: string[];
  occasion?: string;
  material?: string;
  dimensions?: string;
  weight?: string;
  careInstructions?: string;
  maxOrderQuantity?: string;
  deliveryType?: string;
  deliveryAvailability?: string;
  deliveryEstimated?: string;
  customizationAvailable: boolean;
  customizationOptions?: string;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: String, required: true },
    rating: String,
    reviews: String,
    discount: String,
    highlight: String,
    category: { type: String, required: true },
    tags: { type: [String], default: [] },
    brand: String,
    seller: String,
    inStock: { type: Boolean, default: true },
    warranty: String,
    returnPolicy: String,
    imageUrl: {
      type: [{ type: String }],
      required: true
    },
    occasion: String,
    material: String,
    dimensions: String,
    weight: String,
    careInstructions: String,
    maxOrderQuantity: String,
    deliveryType: String,
    deliveryAvailability: String,
    deliveryEstimated: String,
    customizationAvailable: { type: Boolean, default: false },
    customizationOptions: String,
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", productSchema);
