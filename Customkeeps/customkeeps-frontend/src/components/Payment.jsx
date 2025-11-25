import React, { useEffect, useState, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// --- Helper: call backend to create PaymentIntent ---
async function createPaymentIntent(amount, couponCode, token) {
  const response = await fetch(`${API_URL}/api/checkout/pay/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount, coupon_code: couponCode || "" }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Payment intent failed");
  }
  return await response.json(); // { clientSecret, paymentIntentId }
}

// --- Inner form that talks to Stripe ---
function CheckoutForm({
  amount,
  onPaymentSuccess,
  userEmail,
  couponCode,
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Hold-to-pay state
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdTimerRef = useRef(null);
  const holdStartRef = useRef(null);

  // Create a PaymentIntent when component mounts
  useEffect(() => {
    async function initPayment() {
      try {
        setStatus("idle");
        setErrorMessage("");

        const token = localStorage.getItem("token");
        if (!token) {
          setStatus("error");
          setErrorMessage("You must be logged in to pay.");
          return;
        }

        console.log('Creating payment intent for amount:', amount);
        const data = await createPaymentIntent(amount, couponCode, token);
        console.log('Payment intent created:', data);
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
      } catch (err) {
        console.error('Payment intent error:', err);
        setStatus("error");
        setErrorMessage(err.message || "Failed to start payment.");
      }
    }

    if (amount > 0) {
      initPayment();
    }
  }, [amount, couponCode]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current);
      }
    };
  }, []);

  const handleMouseDown = () => {
    if (!stripe || !elements || !clientSecret || status === "processing") return;
    
    setIsHolding(true);
    holdStartRef.current = Date.now();
    
    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartRef.current;
      const progress = Math.min((elapsed / 1500) * 100, 100);
      setHoldProgress(progress);
      
      if (progress >= 100) {
        clearInterval(holdTimerRef.current);
        processPayment();
      }
    }, 16);
  };

  const handleMouseUp = () => {
    setIsHolding(false);
    setHoldProgress(0);
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (isHolding) {
      handleMouseUp();
    }
  };

  async function processPayment() {
    if (!stripe || !elements || !clientSecret) return;

    console.log('=== Processing Payment ===');
    setStatus("processing");
    setErrorMessage("");
    setIsHolding(false);
    setHoldProgress(0);

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              ...(userEmail && userEmail.includes("@")
                ? { email: userEmail }
                : {}),
            },
          },
        }
      );

      if (error) {
        console.error('Stripe error:', error);
        setStatus("error");
        setErrorMessage(error.message || "Payment failed.");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log('✅ Payment succeeded!', paymentIntent);
        setStatus("succeeded");
        
        // Call parent handler to create order in database
        if (onPaymentSuccess) {
          console.log('Calling onPaymentSuccess with:', paymentIntentId, couponCode);
          await onPaymentSuccess(paymentIntentId, couponCode);
        }
        
        // Redirect to orders page after 1.5 seconds
        setTimeout(() => {
          console.log('Redirecting to /orders');
          window.location.href = "/orders";
        }, 1500);
      } else {
        console.error('Unexpected payment status:', paymentIntent?.status);
        setStatus("error");
        setErrorMessage("Unexpected payment status.");
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      setStatus("error");
      setErrorMessage("Payment failed: " + err.message);
    }
  }

  return (
    <div className="payment-container">
      <h2>Payment</h2>
      <p>Total: ₱{amount.toFixed(2)}</p>

      {status === "processing" && (
        <p style={{ color: "#75d481", fontWeight: "bold" }}>Processing payment...</p>
      )}
      {status === "succeeded" && (
        <p style={{ color: "#75d481", fontWeight: "bold" }}>
          Payment successful! Thank you. Redirecting...
        </p>
      )}
      {status === "error" && (
        <p style={{ color: "#c44d3d", fontWeight: "bold" }}>Error: {errorMessage}</p>
      )}

      <div style={{ width: "100%" }}>
        <div className="card-element-wrapper">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#333",
                  "::placeholder": {
                    color: "#999",
                  },
                },
                invalid: {
                  color: "#c44d3d",
                },
              },
            }}
          />
        </div>

        <button
          type="button"
          className="hold-to-pay-btn"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          disabled={!stripe || !clientSecret || status === "processing" || status === "succeeded"}
          style={{
            background: isHolding
              ? `linear-gradient(to right, #75d481 ${holdProgress}%, #ffffff ${holdProgress}%)`
              : "#75d481",
            color: isHolding && holdProgress > 50 ? "#ffffff" : isHolding ? "#333" : "#ffffff",
            border: "2px solid #75d481",
          }}
        >
          {status === "processing"
            ? "Processing..."
            : status === "succeeded"
            ? "Success!"
            : isHolding
            ? `Hold to Pay (${Math.floor(holdProgress)}%)`
            : "Hold to Pay"}
        </button>
      </div>
    </div>
  );
}

// --- Wrapper component used by CartPage ---
export default function Payment({
  amount,
  onPaymentSuccess,
  userEmail,
  couponCode,
}) {
  if (!stripePromise) {
    return <p>Stripe is not configured. Missing publishable key.</p>;
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        amount={amount}
        onPaymentSuccess={onPaymentSuccess}
        userEmail={userEmail}
        couponCode={couponCode}
      />
    </Elements>
  );
}
