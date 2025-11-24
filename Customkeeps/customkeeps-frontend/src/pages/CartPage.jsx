// src/pages/CartPage.jsx

import React, { useState, useMemo } from "react";
import Cart from "../components/Cart";
import Payment from "../components/Payment";

export default function CartPage({
  cartItems,
  onRemove,
  onPaymentSuccess,
  paymentComplete,
  userEmail,
}) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  const showPayment = cartItems.length > 0;

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [cartItems]
  );

  const discountRate =
    appliedCoupon.toUpperCase() === "SAVE10" ? 0.1 : 0;
  const discountAmount = cartTotal * discountRate;
  const finalAmount = cartTotal - discountAmount;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setAppliedCoupon("");
      setCouponMessage("Please enter a code.");
      return;
    }

    if (couponCode.trim().toUpperCase() === "SAVE10") {
      setAppliedCoupon("SAVE10");
      setCouponMessage("Coupon applied: 10% off.");
    } else {
      setAppliedCoupon("");
      setCouponMessage("Invalid coupon code.");
    }
  };

  return (
    <div className="main-container">
      <h1 className="header">Your Shopping Cart</h1>

      {/* Cart section */}
      <section className="cart-section">
        {/* Add spacing + red style for the remove button via CSS class */}
        <Cart items={cartItems} onRemove={onRemove} />
      </section>

      {/* Coupon + summary */}
      {showPayment && (
        <section
          style={{
            maxWidth: 640,
            margin: "18px auto 0",
            fontSize: "0.95rem",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              marginBottom: "6px",
            }}
          >
            <input
              type="text"
              placeholder="Coupon code (try SAVE10)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 4,
                border: "1px solid #d6d3cd",
                fontFamily: "inherit",
                fontSize: "0.95rem",
              }}
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="btn-green"
              style={{ whiteSpace: "nowrap", paddingInline: "18px" }}
            >
              Apply
            </button>
          </div>
          {couponMessage && (
            <p
              style={{
                margin: "4px 0 8px",
                color:
                  appliedCoupon === "SAVE10" ? "#22695a" : "#c53030",
              }}
            >
              {couponMessage}
            </p>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 2,
            }}
          >
            <span>Subtotal: ₱{cartTotal.toFixed(2)}</span>
            {discountAmount > 0 && (
              <span style={{ color: "#22695a" }}>
                Discount (SAVE10): −₱{discountAmount.toFixed(2)}
              </span>
            )}
            <strong>Total after discount: ₱{finalAmount.toFixed(2)}</strong>
          </div>
        </section>
      )}

      {/* Payment section */}
      {showPayment && (
        <section className="payment-section">
          <Payment
            cartItems={cartItems}
            onPaymentSuccess={onPaymentSuccess}
            userEmail={userEmail}
            finalAmount={finalAmount}
            couponCode={appliedCoupon}
          />
        </section>
      )}
    </div>
  );
}
