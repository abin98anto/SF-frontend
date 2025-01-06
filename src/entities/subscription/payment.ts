export interface PaymentIntentResponse {
  clientSecret: string;
}

export interface PlanDetails {
  name: string;
  price: number;
  isAnnual: boolean;
}

export default class Order {
  constructor(
    public userId: string,
    public item: string,
    public amount: number,
    public razorpayOrderId?: string,
    public status: "pending" | "completed" | "failed" = "pending"
  ) {}
}
