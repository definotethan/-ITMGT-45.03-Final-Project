import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

import OrdersPage from "./pages/OrdersPage";
import CartPage from "./pages/CartPage";
import Register from "./components/Register";
import Login from "./components/Login";
import CustomizationForm from "./components/CustomizationForm";
import { OrderProvider, useOrders } from "./context/OrderContext";

import "./App.css";

const products = [
  {
    id: 1,
    name: "Custom T-Shirt",
    price: 500,
    desc: "Wear your story with personalized designs.",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
  },
  {
    id: 2,
    name: "Personalized Mug",
    price: 300,
    desc: "Perfect for hot drinks and gifting.",
    img: "https://images.unsplash.com/photo-1517705008128-361805f42e86",
  },
  {
    id: 3,
    name: "Custom Tote Bag",
    price: 400,
    desc: "Eco-friendly and stylish for your daily needs.",
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
  },
];

function AppInner() {
  const [cartItems, setCartItems] = useState([]);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [addToCartMessage, setAddToCartMessage] = useState(""); // NEW
  const navigate = useNavigate();
  const { addOrder } = useOrders();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    setIsAuthenticated(!!token);
    if (email) setCurrentUserEmail(email);
  }, []);

  const handleRegister = () => {};

  const handleLogin = () => {
    setIsAuthenticated(true);
    const email = localStorage.getItem("email");
    if (email) setCurrentUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setIsAuthenticated(false);
    setPaymentComplete(false);
    setCartItems([]);
    setCurrentUserEmail("");
    navigate("/");
  };

  const handleAddToCart = (data) => {
    const product = products.find((p) => p.name === data.productName);
    if (!product) return;
    const newItem = {
      id: Date.now(),
      productName: data.productName,
      price: product.price,
      quantity: data.quantity,
      customizationText: data.customizationText,
    };
    setCartItems((prev) => [...prev, newItem]);
    setAddToCartMessage("Item added to cart!");        // NEW
    setTimeout(() => setAddToCartMessage(""), 2500);   // NEW
  };

  const handleRemoveFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePaymentSuccess = (orderDetails) => {
    addOrder({
      orderId: Date.now(),
      status: "Preparing",
      total: cartItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      ),
      date: new Date().toISOString().slice(0, 10),
      details: orderDetails,
      items: cartItems,
    });
    setPaymentComplete(true);
    setCartItems([]);
    navigate("/orders");
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <Link to="/" className="nav-brand">
          CustomKeeps
        </Link>
        {isAuthenticated ? (
          <span className="nav-links">
            <Link to="/" className="nav-link-btn">
              Home
            </Link>
            <Link to="/cart" className="nav-link-btn">
              Cart ({cartItems.length})
            </Link>
            <Link to="/orders" className="nav-link-btn">
              Orders
            </Link>
            <button className="logout-btn-nav" onClick={handleLogout}>
              Logout
            </button>
          </span>
        ) : (
          <span className="nav-links">
            <Link to="/" className="nav-link-btn">
              Home
            </Link>
          </span>
        )}
      </nav>

      {/* ROUTES */}
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <div className="main-container">
                <h1 className="header">CustomKeeps Products</h1>
                <div className="products-row">
                  {products.map((p) => (
                    <div className="product-card" key={p.name}>
                      <img src={p.img} alt={p.name} />
                      <div className="product-name">{p.name}</div>
                      <div className="product-price">₱{p.price}</div>
                      <div className="product-desc">{p.desc}</div>
                    </div>
                  ))}
                </div>
                <div className="customization-card">
                  <h2>Customize Your Product</h2>
                  <CustomizationForm onSubmit={handleAddToCart} />
                  {addToCartMessage && (
                    <p className="success-message">{addToCartMessage}</p>
                  )}
                </div>
                {paymentComplete && (
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "1.17rem",
                      marginTop: "20px",
                    }}
                  >
                    Thank you for your purchase!
                  </p>
                )}
              </div>
            ) : (
              <div className="main-container auth-main">
                {/* auth-main just uses main-container flex centering */}
                <div className="auth-container">
                  <Register onRegister={handleRegister} />
                  <Login onLogin={handleLogin} />
                </div>
              </div>
            )
          }
        />

        {isAuthenticated && (
          <Route
            path="/cart"
            element={
              <div className="main-container">
                <CartPage
                  cartItems={cartItems}
                  onRemove={handleRemoveFromCart}
                  onPaymentSuccess={handlePaymentSuccess}
                  paymentComplete={paymentComplete}
                  userEmail={currentUserEmail}
                />
              </div>
            }
          />
        )}

        {isAuthenticated && (
          <Route
            path="/orders"
            element={
              <div className="main-container">
                <OrdersPage />
              </div>
            }
          />
        )}

        <Route
          path="*"
          element={
            <div className="main-container">
              <p
                style={{
                  textAlign: "center",
                  color: "red",
                  marginTop: "50px",
                }}
              >
                Page Not Found.
              </p>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

// Use OrderProvider at the top level
export default function App() {
  return (
    <OrderProvider>
      <AppInner />
    </OrderProvider>
  );
}
