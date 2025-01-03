export default class SubscriptionPlan {
  constructor(
    public name?: string,
    public description?: string,
    public features?: string[],
    public price?: number,
    public discountPrice?: number,
    public discountValidUntil?: Date,
    public isActive?: boolean,
    public _id?: string,
    public createdAt?: Date
  ) {}
}
