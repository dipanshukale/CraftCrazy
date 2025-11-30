import mongoose, {Schema,Document,Types} from "mongoose";
import { IDemand } from "../types/demandTypes";

export interface IDemandDocument extends IDemand,Document {
    _id: Types.ObjectId;
};

const DemandSchema = new Schema<IDemandDocument>({
    name:{type:String,required:true},
    email:{type:String,required:true},
    phone:{type:Number,required:true},
    product:{type:String,required:true},
    customization:{type:String},
    imageUrl:{type:String}
});

export const Demand = mongoose.model<IDemandDocument>("Demand",DemandSchema);