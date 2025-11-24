import React from "react";

export default function Cart({ items, onRemove }) {
  if (!items.length) return <p>Your cart is empty.</p>;

  return (
    <div>
      <h2 style={{ marginTop: 0, marginBottom: 12 }}>Cart</h2>
      <ul style={{ listStyle: "disc", paddingLeft: "1.4rem", margin: 0 }}>
        {items.map(
          ({ id, productName, price, quantity, customizationText }) => (
            <li
              key={id}
              style={{
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <span>
                <strong>{productName}</strong> (Qty: {quantity})
                {" | "}₱{price} each
                {" | "}Subtotal:{" "}
                <strong>₱{(price * quantity).toLocaleString()}</strong>
                {customizationText && <em>: {customizationText}</em>}
              </span>

              <button
                type="button"
                className="remove-btn"
                onClick={() => onRemove(id)}
              >
                Remove
              </button>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
