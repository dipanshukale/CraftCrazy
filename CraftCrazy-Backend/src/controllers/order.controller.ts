import { Request,Response,NextFunction } from "express";
import * as orderService from "../services/order.service";


export const createOrder = async (req:Request, res:Response, next: NextFunction) => {
    try {
        const data = await orderService.createOrderService(req.body);
        res.status(201).json(data);
    } catch (error) {
        next(error);
    }
}

export const completeOrder = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {orderDBId, razorpayPaymentId, razorpayOrderId, razorpaySignature} = req.body;
        const order = await orderService.completeOrderService({
            orderDBId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        });
        res.json(order);
    } catch (error) {
        next(error);
    }
}

export const failedOrder = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {orderDBId, reason} = req.body;
        const order = await orderService.failOrderService(orderDBId, reason);
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
}

export const getAllOrders = async(req:Request,res:Response,next:NextFunction) => {
    try {
        const allOrders = await orderService.getAllOrders();
        res.status(200).json({success:true,message:allOrders.length > 0 ? "Orders fetched successfully" : "No orders found", data:allOrders});
    } catch (error) {   
        next(error);
    }
}

export const getAllProducts = async(req:Request,res:Response,next:NextFunction) => {
    try {
        const allProduct = await orderService.getAllProductsFromOrders();
        res.status(200).json({
        success: true,
        count: allProduct.length,
        data: allProduct,
    });
    } catch (error) {
        next(error);
    }
}

export const getAllCustomerNames = async (req: Request, res: Response) => {
  try {
    const customers = await orderService.getAllCustomerNamesService();
    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching customer names",
      error: error.message,
    });
  }
};

export const getOrdersByOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.params;
    const orders = await orderService.getOrdersByOrderStatusService(status);
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders by orderStatus",
      error: error.message,
    });
  }
};

export const getOrdersByTransactionStatus = async (req: Request, res: Response) => {
  try {
    const { transactionStatus } = req.params;
    const orders = await orderService.getOrdersByTransactionStatusService(transactionStatus);
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders by transactionStatus",
      error: error.message,
    });
  }
};

export const getActiveOrders = async (req: Request, res: Response) => {
  try {
    const activeOrders = await orderService.getActiveOrdersService();
    res.status(200).json({
      success: true,
      count: activeOrders.length,
      data: activeOrders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching active orders",
      error: error.message,
    });
  }
};

export const updateOrderStatus = async(req:Request,res:Response,next:NextFunction) => {
    try {
        const {orderId} = req.params;
        const {status} = req.body;

        const updatedOrder = await orderService.orderUpdate(orderId,status);
        res.status(200).json({message:"Order status updated Successfully",order:updatedOrder});
    } catch (error:any) {
        res.status(400).json({message: error.message});
    }
}

export const deleteOrder = async(req:Request,res:Response,next:NextFunction)=> {
      const {orderId} = req.params;

      try {
        const result = await orderService.deleteOrderService(orderId);

        if(!result){
          return res.status(404).json({message:"Order not found"});
        }

        res.status(200).json({message:"Order Deleted Successfully"});
      } catch (error) {
        next(error);
      }
}

