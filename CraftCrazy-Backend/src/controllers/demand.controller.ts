import { NextFunction, Request, Response } from "express";
import * as demandService from "../services/demand.service";
import { uploadToCloudinary } from "../utils/cloudinary";
import multer from "multer";

const storage = multer.memoryStorage();
export const uploadMiddleware = multer({ storage }).single("image");

export const createDemandController = async (req: Request, res: Response) => {

  try {
    const { name, email, phone, product, customization } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const cloudinaryResult: any = await uploadToCloudinary(req.file.buffer, "demands");

    const newDemand = await demandService.createDemandService({
      name,
      email,
      phone,
      product,
      customization,
      imageUrl: cloudinaryResult.secure_url,
    });

    res.status(201).json({
      message: "Demand created successfully",
      demand: newDemand,
    });

  } catch (error: any) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const demandOrders = async(req:Request,res:Response,next:NextFunction) => {
      try {
         const allDemandOrders = await demandService.getAllDemandService();
         res.status(200).json({message:"All customized Orders", customizedOrder: allDemandOrders});
      } catch (error) {
          next(error);
      }
}
