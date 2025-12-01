import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

import OrdersPage from "./pages/OrdersPage";
import CartPage from "./pages/CartPage";
import Register from "./components/Register";
import Login from "./components/Login";
import CustomizationForm from "./components/CustomizationForm";
import { OrderProvider, useOrders } from "./context/OrderContext";
import logo from "./assets/logo.png";
import logoSmall from "./assets/small.png";

import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function AppInner() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [addToCartMessage, setAddToCartMessage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const navigate = useNavigate();
  const { addOrder } = useOrders();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    setIsAuthenticated(!!token);
    if (email) setCurrentUserEmail(email);

    if (token) {
      fetchProducts();
      fetchCartItems();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/products/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Products fetched:", data);
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/cart/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Cart items fetched:", data);
        setCartItems(data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const handleRegister = () => {};

  const handleLogin = () => {
    setIsAuthenticated(true);
    const email = localStorage.getItem("email");
    if (email) setCurrentUserEmail(email);
    fetchProducts();
    fetchCartItems();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setIsAuthenticated(false);
    setPaymentComplete(false);
    setCartItems([]);
    setProducts([]);
    setCurrentUserEmail("");
    setIsMobileNavOpen(false);
    navigate("/");
  };

  const handleAddToCart = async (data) => {
    const product = products.find((p) => p.name === data.productName);
    if (!product) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/cart/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_name: data.productName,
          price: product.price,
          quantity: data.quantity,
          base_color: data.baseColor,
          customization_text: data.customizationText || "",
          design_image_url: data.designImageUrl,
        }),
      });

      if (response.ok) {
        await fetchCartItems();
        setAddToCartMessage("Item added to cart!");
        setTimeout(() => setAddToCartMessage(""), 2500);
        setSelectedProduct(null);
      } else {
        console.error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleBuyNow = async (data) => {
    const product = products.find((p) => p.name === data.productName);
    if (!product) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/cart/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_name: data.productName,
          price: product.price,
          quantity: data.quantity,
          base_color: data.baseColor,
          customization_text: data.customizationText || "",
          design_image_url: data.designImageUrl,
        }),
      });

      if (response.ok) {
        await fetchCartItems();
        setSelectedProduct(null);

        setTimeout(() => {
          navigate("/cart");
        }, 100);
      } else {
        console.error("Failed to add to cart");
        alert("Failed to add item to cart. Please try again.");
      }
    } catch (error) {
      console.error("Error in buy now:", error);
      alert("Error adding item to cart. Please try again.");
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/api/cart/${itemId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchCartItems();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId, couponCode) => {
    console.log("=== Payment Success Handler Called ===");
    console.log("Payment Intent ID:", paymentIntentId);
    console.log("Coupon Code:", couponCode);

    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token ? "exists" : "missing");

      const requestBody = {
        payment_intent_id: paymentIntentId,
        coupon_code: couponCode || "",
      };
      console.log("Request body:", requestBody);

      const response = await fetch(`${API_URL}/api/orders/create_from_cart/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);
      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (response.ok) {
        console.log("✅ Order created successfully!");
        await fetchCartItems();
        setPaymentComplete(true);
      } else {
        console.error("❌ Order creation failed:", responseData);
        alert(
          "Failed to create order: " + (responseData.error || "Unknown error")
        );
      }
    } catch (error) {
      console.error("❌ Error creating order:", error);
      alert("Error creating order: " + error.message);
    }
  };

  const closeMobileNav = () => setIsMobileNavOpen(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <Link to="/" className="nav-brand" onClick={closeMobileNav}>
          <img src={logoSmall} alt="CustomKeeps" className="nav-logo" />
        </Link>

        {/* Desktop links */}
        <span className="nav-links">
          {isAuthenticated ? (
            <>
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
            </>
          ) : (
            <Link to="/" className="nav-link-btn">
              Home
            </Link>
          )}
        </span>

        {/* Mobile hamburger */}
        <button
          className="nav-toggle"
          type="button"
          onClick={() => setIsMobileNavOpen((prev) => !prev)}
        >
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
        </button>
      </nav>

      {/* Mobile menu */}
      {isAuthenticated && isMobileNavOpen && (
        <div className="nav-links-mobile">
          <Link to="/" className="nav-link-btn" onClick={closeMobileNav}>
            Home
          </Link>
          <Link to="/cart" className="nav-link-btn" onClick={closeMobileNav}>
            Cart ({cartItems.length})
          </Link>
          <Link to="/orders" className="nav-link-btn" onClick={closeMobileNav}>
            Orders
          </Link>
          <button className="logout-btn-nav" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      {/* Global Success Message */}
      {addToCartMessage && (
        <div className="global-success-message">
          <div className="success-toast">✓ {addToCartMessage}</div>
        </div>
      )}

      {/* ROUTES */}
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <div className="main-container">
                <div className="hero-section">
                  <img
                    src={logo}
                    alt="CustomKeeps - Wear Your Story"
                    className="hero-logo"
                  />
                </div>

                <div className="products-section">
                  <div className="section-header">
                    <h2 className="section-title">Our Products</h2>
                    <p className="product-count">
                      {products.length} products available
                    </p>
                  </div>

                  {products.length === 0 ? (
                    <p
                      style={{
                        textAlign: "center",
                        color: "#666",
                        marginTop: "40px",
                      }}
                    >
                      No products available. Add products in Django admin.
                    </p>
                  ) : (
                    <div className="products-row">
                      {products.map((p) => (
                        <div className="product-card" key={p.id}>
                          <div className="product-image-wrapper">
                            <img
                              src={
                                p.image_url ||
                                "https://via.placeholder.com/400x400?text=No+Image"
                              }
                              alt={p.name}
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/400x400?text=Image+Error";
                              }}
                            />
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
                            <p className="product-desc">{p.description}</p>
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
                  )}
                </div>

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
                        <img
                          src={
                            selectedProduct.image_url ||
                            "https://via.placeholder.com/150?text=No+Image"
                          }
                          alt={selectedProduct.name}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/150?text=Error";
                          }}
                        />
                        <div>
                          <p className="modal-product-name">
                            {selectedProduct.name}
                          </p>
                          <p className="modal-product-price">
                            ₱{selectedProduct.price}
                          </p>
                        </div>
                      </div>
                      <CustomizationForm
                        onSubmit={handleAddToCart}
                        onBuyNow={handleBuyNow}
                        preSelectedProduct={selectedProduct}
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
