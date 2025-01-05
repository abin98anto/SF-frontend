import { useState, useEffect } from "react";
import "./SubscriptionPage.scss";
import axiosInstance from "../../../utils/axiosConfig";
import SubscriptionPlan from "../../../entities/subscription/subscription";
import { useAppSelector } from "../../../hooks/hooks";
import { RootState } from "../../../redux/store";
import { SubscriptionType } from "../../../entities/user/UserDetails";

const SubscriptionPage = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isAnnual, setIsAnnual] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userInfo = useAppSelector((state: RootState) => state.user.userInfo);
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axiosInstance.get("/admin/subscriptions");
        if (!response) {
          throw new Error("Failed to fetch plans");
        }
        const data = response.data.data;
        const freePlan: SubscriptionPlan = {
          name: "",
          description: "Start your learning journey",
          features: ["Browse courses", "View syllabus"],
          price: 0,
          discountPrice: 0,
          isActive: true,
        };
        setPlans([
          freePlan,
          ...data.filter((plan: SubscriptionPlan) => plan.isActive),
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return <div className="subscription-container">Loading...</div>;
  }

  if (error) {
    return <div className="subscription-container">Error: {error}</div>;
  }

  const calculatePrice = (plan: SubscriptionPlan) => {
    if (plan.price === 0) return 0;
    const basePrice = isAnnual ? plan.price! * 12 * 0.7 : plan.price!;
    return Math.floor(basePrice);
  };

  const isCurrentPlan = (planName: string): boolean => {
    if (!isAuthenticated || !userInfo?.subscription) return false;

    if (
      planName === "" &&
      userInfo.subscription.type === SubscriptionType.FREE
    ) {
      return true;
    }
    const planTypeMap: { [key: string]: SubscriptionType } = {
      Basic: SubscriptionType.BASIC,
      Pro: SubscriptionType.PRO,
    };

    return userInfo.subscription.type === planTypeMap[planName];
  };

  return (
    <div className="subscription-container">
      <div className="header">
        <h1>The Right Plan for Your Business</h1>
        <p>
          We have several powerful plans to showcase your business and get
          discovered as a creative entrepreneur. Everything you need.
        </p>
      </div>

      <div className="billing-toggle">
        <span className={!isAnnual ? "active" : ""}>Bill Monthly</span>
        <div
          className={`toggle ${isAnnual ? "active" : ""}`}
          onClick={() => setIsAnnual(!isAnnual)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setIsAnnual(!isAnnual);
            }
          }}
        />
        <span className={isAnnual ? "active" : ""}>
          Bill Annually (30% off)
        </span>
      </div>

      <div className="plans-grid">
        {plans.map((plan) => (
          <div
            key={`${plan._id}`}
            className={`plan-card ${plan.name === "Pro" ? "highlighted" : ""}`}
          >
            <h3>{plan.name}</h3>
            <div className="price-container">
              <div className="price">
                {plan.price === 0 ? (
                  <>Free</>
                ) : isAnnual ? (
                  <>
                    <span className="original-price">₹{plan.price! * 12}</span>
                    <span className="discount-price">
                      ₹{calculatePrice(plan)}
                    </span>
                  </>
                ) : plan.discountPrice && plan.discountPrice < plan.price! ? (
                  <>
                    <span className="original-price">₹{plan.price}</span>
                    <span className="discount-price">
                      ₹{plan.discountPrice}
                    </span>
                  </>
                ) : (
                  <>₹{plan.price}</>
                )}
                <span className="period">
                  /{plan.price === 0 ? "forever" : isAnnual ? "year" : "month"}
                </span>
              </div>
              {!isAnnual &&
                plan.price !== 0 &&
                plan.discountValidUntil &&
                plan.discountPrice! < plan.price! && (
                  <div className="discount-end">
                    Offer ends{" "}
                    {new Date(plan.discountValidUntil).toLocaleDateString()}
                  </div>
                )}
            </div>
            <ul className="features">
              {plan.features!.map((feature, index) => (
                <li key={`${plan._id}-${index}`}>{feature}</li>
              ))}
            </ul>
            {isCurrentPlan(plan.name!) ? (
              <button type="button" disabled className="current-plan">
                Current Plan
              </button>
            ) : plan.name !== "" ? (
              <button type="button">Choose</button>
            ) : (
              <span></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;
