// src/api/apiService.js

const BASE_URL = import.meta.env.VITE_API_URL;

export async function fetchProducts() {
  const response = await fetch(`${BASE_URL}/api/products/`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return await response.json();
}

export async function createOrder(orderData, token) {
  const response = await fetch(`${BASE_URL}/api/orders/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) throw new Error('Failed to create order');
  return await response.json();
}

export async function registerUser(data) {
  const response = await fetch(`${BASE_URL}/api/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Registration failed');
  return await response.json();
}

export async function loginUser(data) {
  const response = await fetch(`${BASE_URL}/api/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Login failed');
  return await response.json();
}
