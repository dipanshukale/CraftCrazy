// src/routes/review.routes.ts
import express from "express";
import * as reviewCtrl from "../controllers/review.controller";

const router = express.Router();

router.get("/", reviewCtrl.getAllReviewsController);
router.post("/add",reviewCtrl.addReviewController);
router.get("/product/:id", reviewCtrl.getReviewsByProductController);
router.delete("/:id", reviewCtrl.deleteReviewController);

export default router;
