// src/components/Payment.jsx
import React, { useEffect, useState } from "react";
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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setStatus("processing");
    setErrorMessage("");

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

      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 400 }}>
        <div
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginBottom: "12px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                },
              },
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            maxWidth: 200,
            marginTop: 8,
          }}
          disabled={!stripe || !clientSecret || status === "processing"}
        >
          {status === "processing" ? "Paying..." : "Pay Now"}
        </button>
      </form>
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
