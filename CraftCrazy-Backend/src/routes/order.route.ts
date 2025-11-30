import {Router} from "express";
import * as orderCtrl from "../controllers/order.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
router.post("/createOrder",authMiddleware, orderCtrl.createOrder);
router.post("/orderComplete",authMiddleware, orderCtrl.completeOrder);

//admin routes
router.get("/getOrder",orderCtrl.getAllOrders);
router.get("/products",orderCtrl.getAllProducts);
router.get("/customers",orderCtrl.getAllCustomerNames);
router.get("/status/:status",orderCtrl.getOrdersByOrderStatus);
router.get("/transaction/:transactionStatus",orderCtrl.getOrdersByTransactionStatus);
router.get("/active", orderCtrl.getActiveOrders);
router.patch("/order/:orderId",orderCtrl.updateOrderStatus);
router.delete("/:orderId", orderCtrl.deleteOrder);


export default router;