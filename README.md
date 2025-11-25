# 🎨 CustomKeeps - Custom Product E-Commerce Platform

A full-stack e-commerce platform for selling customizable products (tote bags, mugs, t-shirts, etc.) with integrated payment processing and order management.

[![Live Demo](https://img.shields.io/badge/Frontend-Live-brightgreen)](https://customkeeps.vercel.app)
[![Admin Site](https://img.shields.io/badge/API-Live-blue)](https://customkeeps-api.onrender.com/admin/)
[![Backend API](https://img.shields.io/badge/API-Live-blue)](https://itmgt-45-03-final-project.onrender.com)


---

## 👥 Team 

- Ethan Aquino
- Paul Kim
- Luis Quintos
- Arianna Chan
- Harmonie Lin
  
---

## ✨ Features

- 🛍️ **Product Catalog** - Browse customizable products (tote bags, mugs, t-shirts)
- 🎨 **Product Customization** - Add custom text, images, and designs to products
- 🛒 **Shopping Cart** - Add/remove items, adjust quantities, persistent cart storage
- 💳 **Stripe Checkout** - Secure payment processing with Stripe integration
- 👤 **User Authentication** - JWT-based login/register system with secure tokens
- 📦 **Order Management** - Track orders and view complete order history
- 🎯 **Admin Dashboard** - Beautiful admin interface for managing products and orders
- 📱 **Responsive Design** - Mobile-friendly UI that works on all devices
- 🔒 **Secure** - Environment variables for sensitive data, CORS protection

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + Vite
- **Routing:** React Router v6
- **Styling:** CSS3 + Modern Design
- **HTTP Client:** Axios with interceptors
- **Payment:** Stripe.js
- **State Management:** React Context API
- **Deployment:** Vercel

### Backend
- **Framework:** Django 5.1.3
- **API:** Django REST Framework 3.14.0
- **Authentication:** JWT (djangorestframework-simplejwt)
- **Database:** SQLite (development) / PostgreSQL (production)
- **Payment:** Stripe API integration
- **Admin UI:** django-admin-interface with custom theming
- **Static Files:** WhiteNoise for production serving
- **CORS:** django-cors-headers for cross-origin requests
- **Deployment:** Render

---

## 📁 Project Structure

```
Customkeeps/
├── customkeeps_frontend/              # React Frontend (Vercel)
│   ├── src/
│   │   ├── components/               # Reusable React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── Cart.jsx
│   │   ├── pages/                   # Page components (routes)
│   │   │   ├── Home.jsx
│   │   │   ├── ProductCustomizer.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── Payment.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── context/                 # Global state management
│   │   │   └── OrderContext.jsx
│   │   ├── App.jsx                  # Main app component with routing
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles
│   ├── public/                      # Static assets
│   ├── package.json
│   └── vite.config.js
│
├── customkeeps_backend/              # Django Backend (Render)
│   ├── api/                         # Main API application
│   │   ├── models.py               # Database models (Product, Order, Cart)
│   │   ├── views.py                # API view functions
│   │   ├── serializers.py          # DRF serializers for validation
│   │   ├── urls.py                 # API endpoint routes
│   │   └── admin.py                # Django admin configuration
│   ├── customkeeps_backend/
│   │   ├── settings.py             # Django configuration
│   │   ├── urls.py                 # Main URL routing
│   │   └── wsgi.py                 # WSGI application
│   ├── manage.py                   # Django management script
│   ├── requirements.txt            # Python dependencies
│   └── .env                        # Environment variables (local)
│
└── README.md                        # This file
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **Git**
- **Stripe Account** (for payment processing)

### Clone Repository

```bash
git clone https://github.com/definotethan/-ITMGT-45.03-Final-Project.git
cd Customkeeps
```

---

## 🔧 Environment Variables

### Backend (.env)

Create a `.env` file in `customkeeps_backend/` directory:

```env
# Django Settings
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=True

# Stripe API Keys (get from https://dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Database URL (Production only - Render provides this automatically)
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### Get Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click "Developers" → "API keys"
3. Copy your "Publishable key" and "Secret key" (use **test keys** for development)
4. Add them to your `.env` file

---

## 💻 Running Locally

### Backend Setup

```bash
# Navigate to backend directory
cd customkeeps_backend

# Install all Python dependencies
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate

# Create superuser account (for admin access)
python manage.py createsuperuser
# Enter username, email, and password when prompted

# Collect static files
python manage.py collectstatic --noinput

# Start development server
python manage.py runserver
```

**Backend URLs:**
- ✅ API: http://localhost:8000/api/
- ✅ Admin Panel: http://localhost:8000/admin/
- ✅ API Root: http://localhost:8000/

### Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd customkeeps_frontend

# Install JavaScript dependencies
npm install

# Start development server
npm run dev
```

**Frontend URL:**
- ✅ Application: http://localhost:5173

---

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. Push your code to GitHub:
```bash
git add .
git commit -m "Initial commit: CustomKeeps project"
git push origin main
```

2. Go to [Vercel Dashboard](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure deployment settings:
   - **Root Directory:** `customkeeps_frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Click "Deploy"

**Live URL:** https://customkeeps.vercel.app

### Backend Deployment (Render)

1. Push your code to GitHub (if not already done)

2. Go to [Render Dashboard](https://render.com)

3. Click "New +" → "Web Service"

4. Connect your GitHub repository and select the branch

5. Configure the service:
   - **Name:** `customkeeps-api`
   - **Root Directory:** `customkeeps_backend`
   - **Environment:** Python 3
   - **Build Command:**
     ```bash
     pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --no-input
     ```
   - **Start Command:**
     ```bash
     gunicorn customkeeps_backend.wsgi:application
     ```

6. Add Environment Variables in Render Dashboard:
   - `DJANGO_SECRET_KEY`: Generate a new secure key (don't use dev key)
   - `DEBUG`: `False`
   - `ALLOWED_HOSTS`: `customkeeps-api.onrender.com,.onrender.com,customkeeps.vercel.app`
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key

7. Click "Create Web Service"

8. Once deployed, create a superuser in Render Shell:
   - Open your service dashboard
   - Click "Shell" tab
   - Run: `python manage.py createsuperuser`

**Live URLs:**
- ✅ API: https://customkeeps-api.onrender.com
- ✅ Admin: https://customkeeps-api.onrender.com/admin/

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/register/` | Register new user account | No |
| POST | `/api/login/` | Login user and get JWT tokens | No |
| POST | `/api/token/refresh/` | Refresh expired access token | Yes |

**Example: Login Request**
```json
POST /api/login/
{
  "username": "user123",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Products

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products/` | List all products | No |
| GET | `/api/products/{id}/` | Get product details | No |
| POST | `/api/products/` | Create new product | Admin only |
| PUT | `/api/products/{id}/` | Update product | Admin only |
| DELETE | `/api/products/{id}/` | Delete product | Admin only |

**Example Product Response:**
```json
{
  "id": 1,
  "name": "Custom Tote Bag",
  "description": "100% cotton customizable tote bag",
  "price": "19.99",
  "category": "Tote Bag",
  "image_url": "https://i.imgur.com/example.jpg",
  "created_at": "2025-11-25T12:00:00Z"
}
```

### Cart

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/cart/` | Get user's cart items | Yes |
| POST | `/api/cart/` | Add item to cart | Yes |
| PUT | `/api/cart/{id}/` | Update cart item quantity | Yes |
| DELETE | `/api/cart/{id}/` | Remove item from cart | Yes |

### Orders

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/orders/` | Get user's order history | Yes |
| POST | `/api/orders/` | Create new order | Yes |
| GET | `/api/orders/{id}/` | Get order details | Yes |

### Payment

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/create-checkout-session/` | Create Stripe checkout session | Yes |

**Example Checkout Request:**
```json
POST /api/create-checkout-session/
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "customization": "Custom Text Here"
    }
  ]
}
```

---

## 🎨 Admin Panel

Access the beautiful admin dashboard at:

- **Local Development:** http://localhost:8000/admin/
- **Production:** https://customkeeps-api.onrender.com/admin/

Login with your superuser credentials created during setup.

### Admin Features

- ✅ **Manage Products** - Add/Edit/Delete products with image uploads
- ✅ **View Orders** - Track order status and details
- ✅ **User Management** - View user accounts and activity
- ✅ **Cart Items** - Monitor active shopping carts
- ✅ **Custom Theme** - Modern purple design with dark mode support
- ✅ **Analytics Dashboard** - Order counts and revenue tracking

### Customize Admin Theme

1. Login to admin panel
2. Look for **"Admin Interface"** in the left sidebar
3. Click **"Themes"** → **"Default theme"**
4. Customize these settings:
   - **Title:** "CustomKeeps Admin"
   - **Logo:** Upload your logo image
   - **Primary color:** `#667eea` (purple)
   - **Secondary color:** `#764ba2` (dark purple)
   - **Link color:** `#667eea`
5. Click **"Save"** and refresh the page

---

## 🧪 Testing

### Test User Credentials

Create a test user for development:

```bash
python manage.py createsuperuser
```

Follow the prompts to set username, email, and password.

### Test Stripe Cards

Use these test card numbers in Stripe checkout (use any future expiry date and any 3-digit CVC):

| Card Type | Number | Result |
|-----------|--------|--------|
| Visa (Success) | 4242 4242 4242 4242 | Payment succeeds |
| Visa (Decline) | 4000 0000 0000 0002 | Payment fails |
| 3D Secure Required | 4000 0025 0000 3155 | Requires authentication |

**Expiry:** Any future date (e.g., 12/25)
**CVV:** Any 3 digits (e.g., 123)

---

## 🐛 Troubleshooting

### CORS Error When Calling API

**Problem:** `Cross-Origin Request Blocked` error in browser console

**Solution:** 
- Make sure `CORS_ALLOWED_ORIGINS` is configured in Django settings
- Verify your frontend URL is included in the allowed origins list
- Check that `django-cors-headers` is installed and in `MIDDLEWARE`

### Module Not Found Error in Django

**Problem:** `ModuleNotFoundError: No module named 'xxx'`

**Solution:**
```bash
# Reinstall all dependencies
pip install -r requirements.txt
```

### Static Files Not Loading on Render

**Problem:** CSS/JS files return 404 errors in production

**Solution:**
1. Verify build command includes: `python manage.py collectstatic --no-input`
2. Check that `whitenoise` is installed: `pip install whitenoise`
3. Verify `whitenoise` middleware is in settings.py MIDDLEWARE list
4. Force rebuild: In Render dashboard, click "Clear build cache & deploy"

### Stripe Checkout Not Working

**Problem:** Stripe payment modal doesn't appear or payment fails

**Solution:**
- Verify Stripe keys are set correctly in environment variables
- Ensure you're using **test keys** for development (`sk_test_`, `pk_test_`)
- Check browser console for API errors
- Verify Stripe account has test mode enabled

### Database Connection Error on Render

**Problem:** `django.db.utils.OperationalError: could not connect to server`

**Solution:**
- Check that `DATABASE_URL` environment variable is set in Render
- Verify PostgreSQL database is created and running
- In Render Shell, run: `python manage.py migrate`

---

## 🔗 Quick Links

- **Live Frontend:** https://customkeeps.vercel.app
- **Live Backend API:** https://customkeeps-api.onrender.com
- **API Docs:** https://customkeeps-api.onrender.com/api/
- **Admin Dashboard:** https://customkeeps-api.onrender.com/admin/
- **GitHub Repository:** https://github.com/definotethan/-ITMGT-45.03-Final-Project

\\


