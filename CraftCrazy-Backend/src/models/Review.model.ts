import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  productId: string;
  variantId?: string;
  name: string;
  email?: string;
  title?: string;
  comment: string;
  rating: number;
  image?: string;
  date: Date;
}

const reviewSchema = new Schema<IReview>({
  productId: { type: String, required: true },
  variantId: { type: String },
  name: { type: String, required: true },
  email: { type: String },
  title: { type: String },
  comment: { type: String, required: true },
  rating: { type: Number, required: true },
  image: { type: String },
  date: { type: Date, default: Date.now },
});

export default mongoose.model<IReview>("Review", reviewSchema);
