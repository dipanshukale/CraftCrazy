import { Contact } from "../models/contact.mode";
import { IContact } from "../types/contactTypes";

export const CreateContact = async (data:IContact) => {
    const newContact =  await new Contact(data);
    await newContact.save();
};

export const updateContactStatusService = async(id:string,status: "pending" | "resolved") => {
    const updated = await Contact.findByIdAndUpdate(
        id,
        {status},
        {new:true}
    )

    if(!updated) throw new Error("Contact Not Found");
}

export const getAllContacts = async() => {
    return await Contact.find().sort({createdAt:-1});
}