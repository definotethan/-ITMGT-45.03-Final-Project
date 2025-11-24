// src/context/OrderContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";

const OrderContext = createContext();

export function useOrders() {
  return useContext(OrderContext);
}

const BASE_URL = import.meta.env.VITE_API_URL;

async function fetchOrders(token) {
  const response = await fetch(`${BASE_URL}/api/orders/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch orders");
  return await response.json();
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);

  // Optional: fetch orders from backend when user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetchOrders(token)
      .then((data) => {
        // If your backend returns a list of orders, you may need to map fields
        setOrders(data);
      })
      .catch((err) => {
        console.error("Failed to load orders:", err);
      });
  }, []);

  function addOrder(order) {
    setOrders((prev) => [...prev, order]);
  }

  const value = { orders, addOrder };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}
