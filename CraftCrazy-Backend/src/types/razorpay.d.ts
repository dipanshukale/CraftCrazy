declare module "razorpay" {
  interface RazorpayOrderCreateRequest {
    amount: number;
    currency: string;
    receipt?: string;
    payment_capture?: boolean;
    notes?: Record<string, string>;
  }

  interface RazorpayOrder {
    id: string;
    amount: number;
    currency: string;
    receipt?: string;
    status: string;
  }

  class Razorpay {
    constructor(options: { key_id: string; key_secret: string });
    orders: {
      create(params: RazorpayOrderCreateRequest): Promise<RazorpayOrder>;
    };
  }

  export = Razorpay;
}


