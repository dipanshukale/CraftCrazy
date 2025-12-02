"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvoiceById = exports.getAllInvoices = void 0;
const orderModel_1 = require("../models/orderModel");
const getAllInvoices = async () => {
    const orders = await orderModel_1.Order.find().sort({ createdAt: -1 });
    return orders.map((order) => {
        const createdAt = order.createdAt ? new Date(order.createdAt) : new Date();
        return {
            _id: order._id,
            invoiceId: `INV-${order._id.toString().slice(-6).toUpperCase()}`,
            client: order.customer?.name,
            email: order.customer?.email,
            dateIssued: createdAt.toISOString().split("T")[0],
            amount: order.totalAmount,
            items: order.items.map((item) => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                total: item.price * item.quantity,
            })),
            status: order.transactionStatus === "Payment Succeed"
                ? "Paid"
                : order.orderStatus === "Cancelled"
                    ? "Cancelled"
                    : order.orderStatus === "Pending"
                        ? "Pending"
                        : "Due Soon",
            dueDate: new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
        };
    });
};
exports.getAllInvoices = getAllInvoices;
const getInvoiceById = async (id) => {
    const order = await orderModel_1.Order.findById(id);
    if (!order)
        return null;
    const createdAt = order.createdAt ? new Date(order.createdAt) : new Date();
    return {
        _id: order._id,
        invoiceId: `INV-${order._id.toString().slice(-6).toUpperCase()}`,
        client: order.customer?.name,
        email: order.customer?.email,
        dateIssued: createdAt.toISOString().split("T")[0],
        dueDate: new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        amount: order.totalAmount,
        address: order.customer?.address,
        paymentStatus: order.transactionStatus,
        status: order.orderStatus,
        // return **full item details**
        items: order.items.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
        })),
    };
};
exports.getInvoiceById = getInvoiceById;
