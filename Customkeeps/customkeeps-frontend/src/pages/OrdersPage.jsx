import React from "react";
import { useOrders } from "../context/OrderContext";

export default function OrdersPage() {
  const { orders } = useOrders();

  return (
    <div className="orders-page">
      <h1 className="page-title">Your Orders History</h1>

      {orders.length === 0 ? (
        <div className="empty-orders-message">
          <div className="empty-orders-icon">📦</div>
          <h2 className="empty-orders-title">You haven't placed any orders yet.</h2>
          <p className="empty-orders-subtitle">Start shopping to see your orders here!</p>
        </div>
      ) : (
        <>
          <div className="orders-grid">
            {orders.map((order) => (
              <div key={order.orderId || order.id} className="order-card">
                <div className="order-header">
                  <span className="order-number">Order #{order.orderId || order.id}</span>
                  <span className={`order-status status-${order.status.toLowerCase().replace(/ /g, '-')}`}>
                    {order.status}
                  </span>
                </div>

                {/* Order Items */}
                <div className="order-items">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        {item.designImageUrl && (
                          <img 
                            src={item.designImageUrl} 
                            alt={item.productName}
                            className="order-item-image"
                          />
                        )}
                        <div className="order-item-info">
                          <p className="order-item-name">{item.productName}</p>
                          <p className="order-item-quantity">Qty: {item.quantity}</p>
                          {item.baseColor && (
                            <p className="order-item-custom">Color: <strong>{item.baseColor}</strong></p>
                          )}
                          {item.customizationText && (
                            <p className="order-item-custom">"{item.customizationText}"</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-items">No items</p>
                  )}
                </div>

                <div className="order-details">
                  <div className="order-detail-row">
                    <span className="detail-label">Total:</span>
                    <span className="detail-value">
                      ₱{Number(order.total ?? order.total_amount ?? 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="order-detail-row">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value date">
                      {order.date ||
                        new Date(order.created_at || Date.now())
                          .toISOString()
                          .slice(0, 10)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="status-legend">
            Order status codes: Preparing, Ready for Delivery, In Transit, Delivered, Completed
          </p>
        </>
      )}
    </div>
  );
}
