export interface IorderItem {
    productId:string;
    name: string;
    price:number;
    quantity:number;
    customization?:string;
}

export interface IOrder {
    customer : {
        name: string;
        email?: string;
        contact: string;
        address: string;
        apartment?:string;
        city:string;
        state:string;
        pincode:string;
    },
    items:IorderItem[];
    totalAmount:number;
    paymentMethod:string;
    razorPayOrderId?: string;
    razorpayPaymentId?:string;
    createdAt?: Date;


    orderStatus?:string;
    transactionStatus?:string;
}