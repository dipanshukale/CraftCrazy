export interface IContact {
    name:String;
    email:String;
    phone:Number;
    message:String;
    status?: "pending" | "resolved";
    createdAt?: Date;
}