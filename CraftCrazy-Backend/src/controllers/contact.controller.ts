import { Request,Response,NextFunction } from "express";
import * as contactService from "../services/contact.service";
import { getIO } from "../socket/initSocket";


export const addContact = async(req:Request,res:Response,next:NextFunction) => {
    try {
        const {name,email,phone,message} = req.body;

        if(!name || !email || !phone || !message){
            return res.status(400).json({success:false,message:"All required field must be provided."});
        }

        const contact = await contactService.CreateContact({name,email,phone,message});
        getIO().emit("contact-updated", contact);
        res.status(201).json({success:true,message: "Message submitted successfully!",data:contact});

    } catch (error) {
        next(error);
    }
};

export const updateContactStatus = async(req:Request,res:Response,next:NextFunction) => {
    try {
        const {id} = req.params;
        const {status} = req.body;

        if(!status){
            return res.status(400).json({success:false,message:"Status is required"});
        }

        const updatedContact = await contactService.updateContactStatusService(id,status);
        getIO().emit("contact-updated",{id,status});
        return res.json({
            success:true,
            message:"Contact status updated successfully",
            data:updatedContact
        });
    } catch (error) {
        next(error);
    }
}



export const getContact = async(req:Request,res:Response,next:NextFunction) => {
    try {
        const contacts = await contactService.getAllContacts();
        res.status(200).json({success:true,data:contacts});
    } catch (error) {
        next(error);
    }
}
