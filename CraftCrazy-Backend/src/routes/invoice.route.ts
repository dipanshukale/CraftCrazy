import {Router} from "express";
import * as InvoiceCtrl from "../controllers/invoice.controller";


const router = Router();

//for admin panel
router.get("/", InvoiceCtrl.getInvoices);
router.get("/:id",InvoiceCtrl.getInvoiceDetails);

export default router;