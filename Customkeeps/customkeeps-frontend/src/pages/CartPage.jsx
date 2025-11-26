import React, { useState, useMemo } from "react";
import Payment from "../components/Payment";

const API_URL = import.meta.env.VITE_API_URL || "";

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
  const [discountAmount, setDiscountAmount] = useState(0);

  const showPayment = cartItems.length > 0;
  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [cartItems]
  );

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setAppliedCoupon("");
      setCouponMessage("Please enter a code.");
      setDiscountAmount(0);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/preview_coupon/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          coupon_code: couponCode,
          cart_total: cartTotal,
        }),
      });
      const data = await response.json();

      if (response.ok && data.valid) {
        setAppliedCoupon(couponCode.trim());
        setCouponMessage(`✓ Coupon applied: ${data.discount_percent}% off`);
        setDiscountAmount(data.discount_amount);
      } else {
        setAppliedCoupon("");
        setCouponMessage(data.error || "Invalid coupon code.");
        setDiscountAmount(0);
      }
    } catch (error) {
      setAppliedCoupon("");
      setCouponMessage("Failed to validate coupon. Please try again.");
      setDiscountAmount(0);
    }
  };

  const finalAmount = cartTotal - discountAmount;
  const handlePaymentSuccess = async (paymentIntentId) => {
    await onPaymentSuccess(paymentIntentId, appliedCoupon);
  };

  return (
    <div className="cart-page">
      <h1 className="page-title">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart-message">
          <div className="empty-cart-icon">🛒</div>
          <h2 className="empty-cart-title">Your cart is empty</h2>
          <p className="empty-cart-subtitle">Add some items to get started!</p>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="cart-items-wrapper">
            <h2 className="section-subtitle">Cart</h2>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item-card">
                {(item.design_image_url || item.designImageUrl) && (
                  <img
                    src={item.design_image_url || item.designImageUrl}
                    alt={item.product_name || item.productName}
                    className="cart-item-image"
                  />
                )}
                <div className="cart-item-info">
                  <h3 className="cart-item-name">
                    {item.product_name || item.productName}
                  </h3>
                  <p className="cart-item-details">
                    Qty: {item.quantity} | ₱{item.price} each | Subtotal:{" "}
                    <strong>₱{item.quantity * item.price}</strong>
                  </p>
                  {(item.base_color || item.baseColor) && (
                    <p className="cart-item-custom">
                      Color: <strong>{item.base_color || item.baseColor}</strong>
                    </p>
                  )}
                  {(item.customization_text || item.customizationText) && (
                    <p className="cart-item-custom">
                      Custom text: <em>{item.customization_text || item.customizationText}</em>
                    </p>
                  )}
                </div>
                <button className="remove-btn" onClick={() => onRemove(item.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Coupon Section */}
          <div className="coupon-section">
            <input
              type="text"
              placeholder='Enter coupon code (try "SAVE10")'
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="coupon-input"
            />
            <button onClick={handleApplyCoupon} className="apply-coupon-btn">
              Apply
            </button>
          </div>
          {couponMessage && (
            <p className={`coupon-message ${appliedCoupon ? "success" : "error"}`}>
              {couponMessage}
            </p>
          )}

          {/* Totals */}
          <div className="cart-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>₱{cartTotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="total-row discount">
                <span>Discount:</span>
                <span>-₱{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="total-row final">
              <span>Total after discount:</span>
              <span>₱{finalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Section */}
          {showPayment && (
            <div className="payment-wrapper">
              <Payment
                amount={finalAmount}
                onPaymentSuccess={handlePaymentSuccess}
                userEmail={userEmail}
                couponCode={appliedCoupon}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
