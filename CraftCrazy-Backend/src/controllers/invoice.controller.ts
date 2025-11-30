import { Request,Response,NextFunction } from "express";
import *  as invoiceServices from "../services/invoices.service";


export const getInvoices = async(req:Request,res:Response,next:NextFunction)=> {
    try {
        const invoices = await invoiceServices.getAllInvoices();
        res.status(200).json(invoices);
    } catch (error) {
        next(error);
    }
};

export const getInvoiceDetails = async(req:Request,res:Response,next:NextFunction)=> {
    try {
        const invoice = await invoiceServices.getInvoiceById(req.params.id);
        if(!invoice){
            return res.status(404).json({message:"Invoice not found"});
        }

        res.status(200).json(invoice);
    } catch (error) {
        next(error);
    }
}