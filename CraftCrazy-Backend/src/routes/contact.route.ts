import express from "express";
import { addContact,getContact,updateContactStatus } from "../controllers/contact.controller";
const router = express.Router();

router.post("/add", addContact);

//admin routes
router.get("/all", getContact);  
router.patch("/update-status/:id",updateContactStatus);

export default router;
