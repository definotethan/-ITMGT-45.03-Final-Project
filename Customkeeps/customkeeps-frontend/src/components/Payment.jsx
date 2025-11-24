// src/components/Payment.jsx
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

const BASE_URL = import.meta.env.VITE_API_URL;

// --- Helper: call backend to create PaymentIntent ---
async function createPaymentIntent(amount, couponCode, token) {
  const response = await fetch(`${BASE_URL}/api/checkout/pay/`, {
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
  return await response.json(); // { clientSecret: '...' }
}

// --- Inner form that talks to Stripe ---
function CheckoutForm({
  cartItems,
  onPaymentSuccess,
  userEmail,
  finalAmount,
  couponCode,
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState("");
  const [status, setStatus] = useState("idle"); // idle | processing | succeeded | error
  const [errorMessage, setErrorMessage] = useState("");
  
  // Hold-to-pay state
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdTimerRef = useRef(null);
  const holdStartRef = useRef(null);

  const totalAmount =
    typeof finalAmount === "number"
      ? finalAmount
      : cartItems.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0
        );

  // Create a PaymentIntent when component mounts or total changes
  useEffect(() => {
    async function initPayment() {
      try {
        setStatus("processing");
        setErrorMessage("");

        const token = localStorage.getItem("token"); // JWT from login
        if (!token) {
          setStatus("error");
          setErrorMessage("You must be logged in to pay.");
          return;
        }

        const data = await createPaymentIntent(
          totalAmount,
          couponCode,
          token
        );
        setClientSecret(data.clientSecret);
        setStatus("idle");
      } catch (err) {
        console.error(err);
        setStatus("error");
        setErrorMessage(err.message || "Failed to start payment.");
      }
    }

    if (cartItems.length > 0 && totalAmount > 0) {
      initPayment();
    }
  }, [cartItems, totalAmount, couponCode]);

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
    }, 16); // ~60fps
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

    setStatus("processing");
    setErrorMessage("");
    setIsHolding(false);
    setHoldProgress(0);

    const cardElement = elements.getElement(CardElement);

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
      console.error(error);
      setStatus("error");
      setErrorMessage(error.message || "Payment failed.");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setStatus("succeeded");
      if (onPaymentSuccess) {
        onPaymentSuccess({
          paymentIntentId: paymentIntent.id,
          amount: totalAmount,
          couponCode: couponCode || "",
        });
      }
    } else {
      setStatus("error");
      setErrorMessage("Unexpected payment status.");
    }
  }

  if (!cartItems.length) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="payment-container">
      <h2>Payment</h2>
      <p>Total: ₱{totalAmount.toFixed(2)}</p>

      {status === "processing" && <p>Processing payment...</p>}
      {status === "succeeded" && <p>Payment successful! Thank you.</p>}
      {status === "error" && (
        <p style={{ color: "red" }}>Error: {errorMessage}</p>
      )}

      <div style={{ width: "100%", maxWidth: 600 }}>
        <div className="card-element-wrapper">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#333",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#c53030",
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
          disabled={!stripe || !clientSecret || status === "processing"}
          style={{
            background: `linear-gradient(to right, #75d481 ${holdProgress}%, #ffffff ${holdProgress}%)`,
            color: holdProgress > 50 ? '#ffffff' : '#333',
            border: '2px solid #75d481',
          }}
        >
          {isHolding ? `Hold (${Math.floor(holdProgress)}%)` : "Hold to Pay"}
        </button>
      </div>
    </div>
  );
}

// --- Wrapper component used by CartPage or similar ---
export default function Payment({
  cartItems,
  onPaymentSuccess,
  userEmail,
  finalAmount,
  couponCode,
}) {
  if (!stripePromise) {
    return <p>Stripe is not configured. Missing publishable key.</p>;
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        cartItems={cartItems}
        onPaymentSuccess={onPaymentSuccess}
        userEmail={userEmail}
        finalAmount={finalAmount}
        couponCode={couponCode}
      />
    </Elements>
  );
}
