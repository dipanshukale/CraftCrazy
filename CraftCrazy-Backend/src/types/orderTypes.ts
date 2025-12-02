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
    currency?: string;
    paymentMethod:string;
    razorPayOrderId?: string;
    razorpayPaymentId?:string;
    razorpaySignature?: string;
    paymentFailureReason?: string;
    createdAt?: Date;


    orderStatus?:string;
    transactionStatus?:string;
}