import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/orders/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading orders...</p>
      </div>
    );
  }

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
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <span className="order-number">Order #{order.order_id}</span>
                  <span className={`order-status status-${order.status.replace(/_/g, '-')}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Order Items */}
                <div className="order-items">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        {item.design_image_url && (
                          <img 
                            src={item.design_image_url} 
                            alt={item.product_name}
                            className="order-item-image"
                          />
                        )}
                        <div className="order-item-info">
                          <p className="order-item-name">{item.product_name}</p>
                          <p className="order-item-quantity">Qty: {item.quantity}</p>
                          {item.base_color && (
                            <p className="order-item-custom">
                              Color: <strong>{item.base_color}</strong>
                            </p>
                          )}
                          {item.customization_text && (
                            <p className="order-item-custom">"{item.customization_text}"</p>
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
                      ₱{Number(order.final_amount).toFixed(2)}
                    </span>
                  </div>
                  <div className="order-detail-row">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value date">{order.date}</span>
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
