import express from "express";
import { createDemandController,uploadMiddleware,demandOrders } from "../controllers/demand.controller";


const router = express.Router();

router.post("/create",uploadMiddleware,createDemandController);
//addmin panel
router.get("/demandOrder",demandOrders);

export default router;