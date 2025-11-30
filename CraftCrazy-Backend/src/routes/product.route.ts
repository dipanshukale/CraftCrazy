import express from "express";
import * as productCtrl from "../controllers/product.controller";

const router = express.Router();

router.post("/add",productCtrl.uploadMiddleware,productCtrl.createProductController);
router.get("/newarrivals", productCtrl.getAllProdutsController);
router.get("/", productCtrl.searchController);
router.get("/:id", productCtrl.getProductByIdController);
router.patch("/:id", productCtrl.updateProductController);
router.delete("/:id", productCtrl.deleteProductController);

export default router;
