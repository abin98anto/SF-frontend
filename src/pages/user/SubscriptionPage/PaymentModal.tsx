import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./PaymentModal.scss";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientSecret: string;
  planDetails: {
    name: string;
    price: number;
    isAnnual: boolean;
  };
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: any) => void;
  processingPayment: boolean;
  setProcessingPayment: (processing: boolean) => void;
}

export const PaymentModal = ({
  isOpen,
  onClose,
  clientSecret,
  planDetails,
  onPaymentSuccess,
  onPaymentError,
  processingPayment,
  setProcessingPayment,
}: PaymentModalProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessingPayment(true);
    setCardError(null);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        }
      );

      if (error) {
        setCardError(error.message || "Payment failed");
        onPaymentError(error);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        onPaymentSuccess(paymentIntent);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setCardError("An unexpected error occurred");
      onPaymentError(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Complete Your Purchase</h2>
        <div className="plan-details">
          <h3>{planDetails.name} Plan</h3>
          <p>
            ₹{planDetails.price}/{planDetails.isAnnual ? "year" : "month"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-element-container">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
            />
          </div>

          {cardError && <div className="error-message">{cardError}</div>}

          <div className="button-container">
            <button
              type="button"
              onClick={onClose}
              disabled={processingPayment}
            >
              Cancel
            </button>
            <button type="submit" disabled={!stripe || processingPayment}>
              {processingPayment
                ? "Processing..."
                : `Pay ₹${planDetails.price}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
