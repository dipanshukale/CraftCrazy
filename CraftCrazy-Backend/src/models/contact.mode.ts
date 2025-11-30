import mongoose,{Document,Types,Schema} from "mongoose";
import { IContact } from "../types/contactTypes";


export interface IContactQuery extends IContact, Document {
  _id: Types.ObjectId;
}


const contactSchema = new Schema<IContactQuery>({
    name:{type:String,required:true},
    email:{type:String,required:true},
    phone:{type:String,required:true},
    message:{type:String,required:true},
    status: { type: String, enum: ["pending", "resolved"], default: "pending" }
},{ timestamps: true });


export const Contact = mongoose.model<IContactQuery>("Contact",contactSchema);
