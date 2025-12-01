import React, { useState } from "react";

export default function CustomizationForm({ onSubmit, preSelectedProduct, onBuyNow }) {
  const [productName] = useState(preSelectedProduct?.name || preSelectedProduct || "");
  const [quantity, setQuantity] = useState(1);
  const [baseColor, setBaseColor] = useState("White");
  const [designImage, setDesignImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Read template URL directly from the product
  const templateImageUrl = preSelectedProduct?.template_image_url || null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please upload an image file (JPG/PNG)");
        e.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setDesignImage(reader.result);
        setErrorMessage("");
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1 || qty > 100) {
      setErrorMessage("Quantity must be between 1 and 100");
      return false;
    }

    if (!designImage) {
      setErrorMessage("Please upload a design image (JPG/PNG)");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      productName,
      quantity: parseInt(quantity, 10),
      baseColor,
      customizationText: "",
      designImageUrl: designImage,
    };

    onSubmit(data);
    setSuccessMessage("Added to cart!");
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      productName,
      quantity: parseInt(quantity, 10),
      baseColor,
      customizationText: "",
      designImageUrl: designImage,
    };

    onBuyNow(data);
  };

  return (
    <form className="customization-form" onSubmit={handleSubmit}>
      <label>
        Quantity <span style={{ color: "#c53030" }}>*</span>
      </label>
      <input
        type="number"
        min="1"
        max="100"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />

      <label>
        Base Item Color <span style={{ color: "#c53030" }}>*</span>
      </label>
      <select
        value={baseColor}
        onChange={(e) => setBaseColor(e.target.value)}
        required
      >
        <option value="White">White</option>
        <option value="Black">Black</option>
        <option value="Navy Blue">Navy Blue</option>
        <option value="Gray">Gray</option>
        <option value="Red">Red</option>
        <option value="Pink">Pink</option>
        <option value="Yellow">Yellow</option>
        <option value="Green">Green</option>
      </select>

      <label>Design template (for reference)</label>
      {templateImageUrl && (
        <div
          style={{
            marginBottom: "8px",
            padding: "6px",
            borderRadius: "8px",
            border: "1px solid #d6d3cd",
            background: "#fff",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <img
            src={templateImageUrl}
            alt="Design template"
            style={{
              width: "100%",
              height: "260px",        // adjust this value to make it taller/shorter
              objectFit: "contain",   // or "cover" if you want it edge‑to‑edge
              borderRadius: "6px",
              display: "block",
            }}
          />
        </div>
      )}

      {!templateImageUrl && (
        <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "8px" }}>
          No template added for this product yet.
        </p>
      )}
      <p style={{ fontSize: "0.8rem", color: "#666", marginBottom: "8px" }}>
        Use this template as a guide when creating your design, then upload your
        final design below.
      </p>

      <label>
        Upload design (JPG/PNG) <span style={{ color: "#c53030" }}>*</span>
      </label>
      <input
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleFileChange}
        required
      />

      {errorMessage && (
        <p
          style={{
            color: "#c53030",
            fontSize: "0.9rem",
            marginTop: "8px",
            padding: "8px 12px",
            background: "#fee",
            borderRadius: "8px",
            border: "1px solid #fcc",
          }}
        >
          ⚠️ {errorMessage}
        </p>
      )}

      <div className="form-buttons">
        <button type="submit" className="btn-add-to-cart">
          Add to Cart
        </button>
        <button
          type="button"
          className="btn-buy-now"
          onClick={handleBuyNow}
        >
          Buy Now
        </button>
      </div>

      {successMessage && (
        <p className="success-message">{successMessage}</p>
      )}
    </form>
  );
}
