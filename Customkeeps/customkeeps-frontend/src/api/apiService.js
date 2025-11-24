// src/api/apiService.js

const BASE_URL = import.meta.env.VITE_API_URL;

// Helper to build headers with optional JWT
function buildHeaders(token, extra = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...extra,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

// Products
export async function fetchProducts() {
  const response = await fetch(`${BASE_URL}/api/products/`);
  if (!response.ok) throw new Error("Failed to fetch products");
  return await response.json();
}

// Orders
export async function createOrder(orderData, token) {
  const response = await fetch(`${BASE_URL}/api/orders/`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(orderData),
  });
  if (!response.ok) throw new Error("Failed to create order");
  return await response.json();
}

export async function fetchUserOrders(token) {
  const response = await fetch(`${BASE_URL}/api/orders/`, {
    headers: buildHeaders(token),
  });
  if (!response.ok) throw new Error("Failed to fetch orders");
  return await response.json();
}

// Auth
export async function registerUser(data) {
  const response = await fetch(`${BASE_URL}/api/register/`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Registration failed");
  return await response.json();
}

export async function loginUser(data) {
  const response = await fetch(`${BASE_URL}/api/token/`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Login failed");
  return await response.json(); // { access, refresh }
}

export async function refreshToken(refreshToken) {
  const response = await fetch(`${BASE_URL}/api/token/refresh/`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ refresh: refreshToken }),
  });
  if (!response.ok) throw new Error("Token refresh failed");
  return await response.json(); // { access: "newAccessToken" }
}

// Example protected user endpoint (adjust path to your API)
export async function fetchCurrentUser(token) {
  const response = await fetch(`${BASE_URL}/api/user/`, {
    headers: buildHeaders(token),
  });
  if (!response.ok) throw new Error("Failed to fetch current user");
  return await response.json();
}
