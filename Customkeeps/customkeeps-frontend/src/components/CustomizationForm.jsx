import React, { useState } from "react";

export default function CustomizationForm({ onSubmit, preSelectedProduct, onBuyNow }) {
  const [productName] = useState(preSelectedProduct || "");
  const [quantity, setQuantity] = useState(1);
  const [baseColor, setBaseColor] = useState("White");
  const [customizationText, setCustomizationText] = useState("");
  const [designImage, setDesignImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrorMessage("Please upload an image file (JPG/PNG)");
        e.target.value = '';
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
    // Validate quantity
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1 || qty > 100) {
      setErrorMessage("Quantity must be between 1 and 100");
      return false;
    }

    // Validate design image
    if (!designImage) {
      setErrorMessage("Please upload a design image (JPG/PNG)");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const data = {
      productName,
      quantity: parseInt(quantity, 10),
      baseColor,
      customizationText,
      designImageUrl: designImage,
    };
    
    onSubmit(data);
    setSuccessMessage("Added to cart!");
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const data = {
      productName,
      quantity: parseInt(quantity, 10),
      baseColor,
      customizationText,
      designImageUrl: designImage,
    };
    
    onBuyNow(data);
  };

  return (
    <form className="customization-form" onSubmit={handleSubmit}>
      <label>Quantity <span style={{ color: '#c53030' }}>*</span></label>
      <input
        type="number"
        min="1"
        max="100"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />

      <label>Base Item Color <span style={{ color: '#c53030' }}>*</span></label>
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

      <label>Customization Text (Optional)</label>
      <input
        type="text"
        placeholder="Enter your text here..."
        value={customizationText}
        onChange={(e) => setCustomizationText(e.target.value)}
      />

      <label>Upload design (JPG/PNG) <span style={{ color: '#c53030' }}>*</span></label>
      <input 
        type="file" 
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleFileChange}
        required
      />

      {errorMessage && (
        <p style={{ 
          color: '#c53030', 
          fontSize: '0.9rem', 
          marginTop: '8px',
          padding: '8px 12px',
          background: '#fee',
          borderRadius: '8px',
          border: '1px solid #fcc'
        }}>
          ⚠️ {errorMessage}
        </p>
      )}

      <div className="form-buttons">
        <button type="submit" className="btn-add-to-cart">Add to Cart</button>
        <button type="button" className="btn-buy-now" onClick={handleBuyNow}>Buy Now</button>
      </div>

      {successMessage && <p className="success-message">{successMessage}</p>}
    </form>
  );
}
