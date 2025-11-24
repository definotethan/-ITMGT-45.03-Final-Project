import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

import OrdersPage from "./pages/OrdersPage";
import CartPage from "./pages/CartPage";
import Register from "./components/Register";
import Login from "./components/Login";
import CustomizationForm from "./components/CustomizationForm";
import { OrderProvider, useOrders } from "./context/OrderContext";
import logo from './assets/logo.png';
import logoSmall from './assets/small.png';
import shirtsImg from './assets/shirts.png';
import mugsImg from './assets/mugs.png';
import totesImg from './assets/totes.png';

import "./App.css";

const products = [
  {
    id: 1,
    name: "Custom T-Shirt",
    price: 500,
    desc: "Wear your story with personalized designs.",
    img: shirtsImg,
  },
  {
    id: 2,
    name: "Custom Mug",
    price: 300,
    desc: "Perfect for hot drinks and gifting.",
    img: mugsImg,
  },
  {
    id: 3,
    name: "Custom Tote Bag",
    price: 400,
    desc: "Eco-friendly and stylish for your daily needs.",
    img: totesImg,
  },
];

function AppInner() {
  const [cartItems, setCartItems] = useState([]);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [addToCartMessage, setAddToCartMessage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
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
    baseColor: data.baseColor,  // ← ADD THIS LINE
    customizationText: data.customizationText,
    designImageUrl: data.designImageUrl,
  };

  setCartItems((prev) => [...prev, newItem]);
  setAddToCartMessage("Item added to cart!");
  setTimeout(() => setAddToCartMessage(""), 2500);
  setSelectedProduct(null);
};

const handleBuyNow = (data) => {
  const product = products.find((p) => p.name === data.productName);
  if (!product) return;

  const newItem = {
    id: Date.now(),
    productName: data.productName,
    price: product.price,
    quantity: data.quantity,
    baseColor: data.baseColor,  // ← ADD THIS LINE
    customizationText: data.customizationText,
    designImageUrl: data.designImageUrl,
  };

  setCartItems((prev) => [...prev, newItem]);
  setSelectedProduct(null);
  navigate("/cart");
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
          <img src={logoSmall} alt="CustomKeeps" className="nav-logo" />
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

      {/* Global Success Message */}
      {addToCartMessage && (
        <div className="global-success-message">
          <div className="success-toast">
            ✓ {addToCartMessage}
          </div>
        </div>
      )}

      {/* ROUTES */}
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <div className="main-container">
                {/* Hero Section with Logo */}
                <div className="hero-section">
                  <img src={logo} alt="CustomKeeps - Wear Your Story" className="hero-logo" />
                </div>

                {/* Products Section */}
                <div className="products-section">
                  <div className="section-header">
                    <h2 className="section-title">Our Products</h2>
                    <p className="product-count">
                      {products.length} products available
                    </p>
                  </div>

                  <div className="products-row">
                    {products.map((p) => (
                      <div className="product-card" key={p.id}>
                        <div className="product-image-wrapper">
                          <img src={p.img} alt={p.name} />
                          <div className="product-overlay">
                            <button
                              className="btn-customize"
                              onClick={() => setSelectedProduct(p)}
                            >
                              Customize Now
                            </button>
                          </div>
                        </div>
                        <div className="product-info">
                          <h3 className="product-name">{p.name}</h3>
                          <p className="product-desc">{p.desc}</p>
                          <div className="product-footer">
                            <span className="product-price">₱{p.price}</span>
                            <button
                              className="btn-quick-add"
                              onClick={() => setSelectedProduct(p)}
                            >
                              Customize
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customization Modal */}
                {selectedProduct && (
                  <div className="customization-modal-overlay">
                    <div className="customization-modal">
                      <button
                        className="modal-close"
                        onClick={() => setSelectedProduct(null)}
                      >
                        ×
                      </button>
                      <h2>Customize Your {selectedProduct.name}</h2>
                      <div className="modal-product-preview">
                        <img src={selectedProduct.img} alt={selectedProduct.name} />
                        <div>
                          <p className="modal-product-name">{selectedProduct.name}</p>
                          <p className="modal-product-price">₱{selectedProduct.price}</p>
                        </div>
                      </div>
                      <CustomizationForm 
                        onSubmit={handleAddToCart}
                        onBuyNow={handleBuyNow}
                        preSelectedProduct={selectedProduct.name}
                      />
                    </div>
                  </div>
                )}

                {paymentComplete && (
                  <div className="thank-you-message">
                    <p>✓ Thank you for your purchase!</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-page-wrapper">
                <div className="auth-layout">
                  <div className="auth-logo-wrapper">
                    <img src={logo} alt="CustomKeeps" className="auth-logo" />
                  </div>
                  <div className="auth-container">
                    <Register onRegister={handleRegister} />
                    <Login onLogin={handleLogin} />
                  </div>
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
              <p className="error-message">Page Not Found.</p>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <OrderProvider>
      <AppInner />
    </OrderProvider>
  );
}
