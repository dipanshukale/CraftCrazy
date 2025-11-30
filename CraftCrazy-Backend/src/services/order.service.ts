import { Order,IOrderDocument } from "../models/orderModel";
import RazorPay from "razorpay";
import dotenv from "dotenv";
import { getIO } from "../socket/initSocket";


dotenv.config();


const razorpay = new RazorPay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_SECRET_KEY,
});

export const createOrderService = async (orderData:IOrderDocument) => {
    //save data to db first
    const order = new Order(orderData);
    await order.save();

    if(order.paymentMethod === "UPI"){

        const razorpayOrder = await razorpay.orders.create({
            amount:order.totalAmount * 100,
            currency:"INR",
            receipt: order._id.toString(),
            payment_capture: true,
        });

        order.razorPayOrderId = razorpayOrder.id;
        await order.save();
        getIO().emit("order-updated",order);
        getIO().emit("trend:update");



        return {orderDBId: order._id, orderId: razorpayOrder.id};
    }

    return {orderDBId: order._id};
}


export const completeOrderService = async(orderDBId:string, paymentId:string) => {
    const order = await Order.findById(orderDBId);
    if(!order) throw new Error("Order Not Found");

    order.razorpayPaymentId = paymentId;
    order.transactionStatus = "Payment Succeed";
    order.orderStatus = "Processing";
    await order.save();
    getIO().emit("order-updated",order);
    getIO().emit("trend:update");
    return order;
}

export const getAllOrders = async () => {
    return await Order.find().sort({createdAt:-1});
}

export const getAllProductsFromOrders = async () => {
    const orders = await Order.find({}, "items"); 
    const allProducts = orders.flatMap(order => order.items);
    return allProducts;
};

export const getAllCustomerNamesService = async () => {
   const orders = await Order.find({}, "customer createdAt").sort({ createdAt: -1 });

  // Map to customer objects
  const customers = orders.map((o) => ({
    _id: o._id.toString(),
    name: o.customer.name,
    email: o.customer.email,
    phone: o.customer.contact,
    address: `${o.customer.address}, ${o.customer.apartment || ""} ${o.customer.city}, ${o.customer.state} - ${o.customer.pincode}`.trim(),
    createdAt: o.createdAt ? o.createdAt.toISOString() : new Date().toISOString(),
  }));

  // Remove duplicate customers based on email (or name)
  const uniqueCustomersMap = new Map<string, typeof customers[0]>();
  customers.forEach((c) => {
    if (!uniqueCustomersMap.has(c.email)) {
      uniqueCustomersMap.set(c.email, c);
    }
  });

  return Array.from(uniqueCustomersMap.values());
};

export const getOrdersByOrderStatusService = async (status: string) => {
  return await Order.find({ orderStatus: status }).sort({ createdAt: -1 });
};

export const getOrdersByTransactionStatusService = async (transactionStatus: string) => {
  return await Order.find({ transactionStatus }).sort({ createdAt: -1 });
};

export const getActiveOrdersService = async () => {
  return await Order.find({
    orderStatus: { $in: ["Pending", "Processing"] },
  }).sort({ createdAt: -1 });
};

export const orderUpdate = async(orderId:string, Status:string) => {
    const allowedStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];

    if(!allowedStatuses.includes(Status)){
        throw new Error("invalid order status");
    }

    const order = await Order.findById(orderId);
    if(!order) throw new Error("Order not found");

    order.orderStatus = Status;
    await order.save();

    return order;
}

export const deleteOrderService = async(orderId:string) => {
      return await Order.findByIdAndDelete(orderId);
}