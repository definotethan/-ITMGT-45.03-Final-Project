// src/pages/OrdersPage.jsx
import React from "react";
import { useOrders } from "../context/OrderContext";

export default function OrdersPage() {
  const { orders } = useOrders();

  return (
    <div
      className="main-container"
      style={{ textAlign: "center", minHeight: "60vh", padding: "50px" }}
    >
      <h1 className="header" style={{ marginBottom: "20px" }}>
        Your Orders History
      </h1>

      {orders.length === 0 ? (
        <p style={{ fontSize: "1.1rem", color: "#4a4a4a" }}>
          You haven't placed any orders yet.
        </p>
      ) : (
        <table
          style={{
            margin: "0 auto",
            borderCollapse: "collapse",
            minWidth: "320px",
            maxWidth: "500px",
            boxShadow: "0 1px 8px #e7e7e7",
            background: "#fff",
          }}
        >
          <thead>
            <tr>
              <th style={{ padding: "12px", color: "#225642", fontWeight: 600 }}>
                Order #
              </th>
              <th style={{ padding: "12px", color: "#225642", fontWeight: 600 }}>
                Status
              </th>
              <th style={{ padding: "12px", color: "#225642", fontWeight: 600 }}>
                Total
              </th>
              <th style={{ padding: "12px", color: "#225642", fontWeight: 600 }}>
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId || order.id}>
                <td style={{ padding: "10px", fontWeight: 500 }}>
                  #{order.orderId || order.id}
                </td>
                <td style={{ padding: "10px" }}>{order.status}</td>
                <td style={{ padding: "10px" }}>
                  ₱
                  {Number(
                    order.total ?? order.total_amount ?? 0
                  ).toLocaleString()}
                </td>
                <td style={{ padding: "10px", color: "#757575" }}>
                  {order.date ||
                    new Date(order.created_at || Date.now())
                      .toISOString()
                      .slice(0, 10)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p style={{ fontSize: "1.1rem", color: "#4a4a4a", marginTop: "26px" }}>
        Order status codes: Preparing, Ready for Delivery, In Transit, Delivered,
        Completed
      </p>
    </div>
  );
}
