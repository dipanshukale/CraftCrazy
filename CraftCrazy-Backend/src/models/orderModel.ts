import mongoose, { Document, Schema, Types } from "mongoose";
import { IorderItem, IOrder } from "../types/orderTypes";

const orderItemSchema = new Schema<IorderItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  customization: { type: String, required: false },
});

export interface IOrderDocument extends IOrder, Document {
  _id: Types.ObjectId;
}

const OrderSchema = new Schema<IOrderDocument>(
  {
    customer: {
      name: { type: String, required: true },
      email: { type: String },
      contact: { type: String, required: true },
      address: { type: String, required: true },
      apartment: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    paymentMethod: { type: String, required: true, enum: ["UPI", "CASH", "CARD"] },
    razorPayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    paymentFailureReason: { type: String },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    transactionStatus: {
      type: String,
      enum: ["Payment Pending", "Payment Succeed", "Payment Failed"],
      default: "Payment Pending",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrderDocument>("Order", OrderSchema);
