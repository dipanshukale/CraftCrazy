import { Order } from "../models/orderModel";

export const getAllInvoices = async () => {
  const orders = await Order.find().sort({ createdAt: -1 });

  return orders.map((order) => {
    const createdAt = order.createdAt ? new Date(order.createdAt) : new Date();

    return {
      _id: order._id,
      invoiceId: `INV-${order._id.toString().slice(-6).toUpperCase()}`,
      client: order.customer?.name,
      email: order.customer?.email,
      dateIssued: createdAt.toISOString().split("T")[0],
      amount: order.totalAmount,
      items: order.items.map((item: any) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
      })),
      status:
        order.transactionStatus === "Payment Succeed"
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

export const getInvoiceById = async (id: string) => {
  const order = await Order.findById(id);
  if (!order) return null;

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
    items: order.items.map((item: any) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity,
    })),
  };
};
