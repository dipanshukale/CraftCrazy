"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrderService = exports.orderUpdate = exports.getActiveOrdersService = exports.getOrdersByTransactionStatusService = exports.getOrdersByOrderStatusService = exports.getAllCustomerNamesService = exports.getAllProductsFromOrders = exports.getAllOrders = exports.completeOrderService = exports.createOrderService = void 0;
const orderModel_1 = require("../models/orderModel");
const razorpay_1 = __importDefault(require("razorpay"));
const dotenv_1 = __importDefault(require("dotenv"));
const initSocket_1 = require("../socket/initSocket");
dotenv_1.default.config();
const { RAZORPAY_KEY_ID, RAZORPAY_SECRET_KEY } = process.env;
if (!RAZORPAY_KEY_ID || !RAZORPAY_SECRET_KEY) {
    throw new Error("Razorpay credentials are missing. Please set RAZORPAY_KEY_ID and RAZORPAY_SECRET_KEY.");
}
const razorpay = new razorpay_1.default({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_SECRET_KEY,
});
const createOrderService = async (orderData) => {
    //save data to db first
    const order = new orderModel_1.Order(orderData);
    await order.save();
    if (order.paymentMethod === "UPI") {
        const razorpayOrder = await razorpay.orders.create({
            amount: order.totalAmount * 100,
            currency: "INR",
            receipt: order._id.toString(),
            payment_capture: true,
        });
        order.razorPayOrderId = razorpayOrder.id;
        await order.save();
        (0, initSocket_1.getIO)().emit("order-updated", order);
        (0, initSocket_1.getIO)().emit("trend:update");
        // Send back all the details the frontend needs, including the
        // public key. This must be the LIVE key configured in env:
        // RAZORPAY_KEY_ID / RAZORPAY_SECRET_KEY.
        return {
            orderDBId: order._id,
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: RAZORPAY_KEY_ID,
        };
    }
    return { orderDBId: order._id };
};
exports.createOrderService = createOrderService;
const completeOrderService = async (orderDBId, paymentId) => {
    const order = await orderModel_1.Order.findById(orderDBId);
    if (!order)
        throw new Error("Order Not Found");
    order.razorpayPaymentId = paymentId;
    order.transactionStatus = "Payment Succeed";
    order.orderStatus = "Processing";
    await order.save();
    (0, initSocket_1.getIO)().emit("order-updated", order);
    (0, initSocket_1.getIO)().emit("trend:update");
    return order;
};
exports.completeOrderService = completeOrderService;
const getAllOrders = async () => {
    return await orderModel_1.Order.find().sort({ createdAt: -1 });
};
exports.getAllOrders = getAllOrders;
const getAllProductsFromOrders = async () => {
    const orders = await orderModel_1.Order.find({}, "items");
    const allProducts = orders.flatMap(order => order.items);
    return allProducts;
};
exports.getAllProductsFromOrders = getAllProductsFromOrders;
const getAllCustomerNamesService = async () => {
    const orders = await orderModel_1.Order.find({}, "customer createdAt").sort({ createdAt: -1 });
    const customers = orders
        .map((o) => {
        if (!o.customer.email) {
            return null;
        }
        return {
            _id: o._id.toString(),
            name: o.customer.name,
            email: o.customer.email,
            phone: o.customer.contact,
            address: `${o.customer.address}, ${o.customer.apartment || ""} ${o.customer.city}, ${o.customer.state} - ${o.customer.pincode}`.trim(),
            createdAt: o.createdAt ? o.createdAt.toISOString() : new Date().toISOString(),
        };
    })
        .filter((customer) => Boolean(customer));
    const uniqueCustomersMap = new Map();
    customers.forEach((c) => {
        if (!uniqueCustomersMap.has(c.email)) {
            uniqueCustomersMap.set(c.email, c);
        }
    });
    return Array.from(uniqueCustomersMap.values());
};
exports.getAllCustomerNamesService = getAllCustomerNamesService;
const getOrdersByOrderStatusService = async (status) => {
    return await orderModel_1.Order.find({ orderStatus: status }).sort({ createdAt: -1 });
};
exports.getOrdersByOrderStatusService = getOrdersByOrderStatusService;
const getOrdersByTransactionStatusService = async (transactionStatus) => {
    return await orderModel_1.Order.find({ transactionStatus }).sort({ createdAt: -1 });
};
exports.getOrdersByTransactionStatusService = getOrdersByTransactionStatusService;
const getActiveOrdersService = async () => {
    return await orderModel_1.Order.find({
        orderStatus: { $in: ["Pending", "Processing"] },
    }).sort({ createdAt: -1 });
};
exports.getActiveOrdersService = getActiveOrdersService;
const orderUpdate = async (orderId, Status) => {
    const allowedStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
    if (!allowedStatuses.includes(Status)) {
        throw new Error("invalid order status");
    }
    const order = await orderModel_1.Order.findById(orderId);
    if (!order)
        throw new Error("Order not found");
    order.orderStatus = Status;
    await order.save();
    return order;
};
exports.orderUpdate = orderUpdate;
const deleteOrderService = async (orderId) => {
    return await orderModel_1.Order.findByIdAndDelete(orderId);
};
exports.deleteOrderService = deleteOrderService;
