# CustomKeeps: Wear Your Story

**README Documentation - Final Project Submission**

---

## Tech Stack & Versions

### **Backend**
- **Django** 5.2.8 - Web framework
- **Django REST Framework** 3.16.1 - API development
- **djangorestframework-simplejwt** 5.5.1 - JWT authentication
- **PostgreSQL** (via psycopg2-binary 2.9.11) - Production database
- **SQLite3** - Local development database
- **Stripe** 14.0.1 - Payment processing
- **django-cors-headers** 4.9.0 - CORS middleware
- **django-admin-interface** 0.31.0 - Enhanced admin UI
- **Gunicorn** 23.0.0 - Production WSGI server
- **WhiteNoise** 6.11.0 - Static file serving
- **python-dotenv** 1.2.1 - Environment variable management

### **Frontend**
- **React** 19.2.0 - UI framework
- **React Router DOM** 7.9.6 - Client-side routing
- **Vite** 7.2.4 - Build tool and dev server
- **@stripe/stripe-js** 8.5.2 - Stripe integration
- **@stripe/react-stripe-js** 5.4.0 - Stripe React components
- **react-hook-form** 7.66.1 - Form validation
- **Axios** 1.13.2 - HTTP client

### **Deployment**
- **Backend**: Render (customkeeps-api.onrender.com)
- **Frontend**: Vercel (customkeeps.vercel.app)
- **Database**: PostgreSQL (Render)

---

## Setup & Deployment Instructions

### **Local Development Setup**

#### **Backend Setup**
```bash
# Navigate to backend directory
cd customkeeps_backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with the following variables:
STRIPE_SECRET_KEY=your_stripe_secret_key
CURRENCY=php
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
SECRET_KEY=your_django_secret_key

# Run migrations
python manage.py migrate

# Create superuser for admin access
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

#### **Frontend Setup**
```bash
# Navigate to frontend directory
cd customkeeps-frontend

# Install dependencies
npm install

# Create .env file with:
VITE_API_URL=http://localhost:8000
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Start development server
npm run dev
```

### **Production Deployment**

#### **Backend (Render)**
1. Connect GitHub repository to Render
2. Set environment variables:
   - `DATABASE_URL` (auto-provided by Render PostgreSQL)
   - `DJANGO_SECRET_KEY`
   - `STRIPE_SECRET_KEY`
   - `DEBUG=False`
3. Build command: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
4. Start command: `gunicorn customkeeps_backend.wsgi:application`

#### **Frontend (Vercel)**
1. Connect GitHub repository to Vercel
2. Set environment variables:
   - `VITE_API_URL=https://customkeeps-api.onrender.com`
   - `VITE_STRIPE_PUBLISHABLE_KEY`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add `vercel.json` for SPA routing (already included)

---

## API Documentation

### **Authentication**

#### **Register User**
- **POST** `/api/register/`
- **Body**: `{ "username": "string", "email": "string", "password": "string" }`
- **Response**: `{ "id": 1, "username": "string", "email": "string" }`

#### **Login**
- **POST** `/api/token/`
- **Body**: `{ "username": "string", "password": "string" }`
- **Response**: `{ "access": "jwt_token", "refresh": "refresh_token" }`

#### **Refresh Token**
- **POST** `/api/token/refresh/`
- **Body**: `{ "refresh": "refresh_token" }`
- **Response**: `{ "access": "new_jwt_token" }`

### **Products**

#### **List Products**
- **GET** `/api/products/`
- **Headers**: `Authorization: Bearer {access_token}`
- **Response**: Array of product objects

### **Cart**

#### **Get Cart Items**
- **GET** `/api/cart/`
- **Headers**: `Authorization: Bearer {access_token}`
- **Response**: Array of cart items

#### **Add to Cart**
- **POST** `/api/cart/`
- **Headers**: `Authorization: Bearer {access_token}`
- **Body**: 
```json
{
  "product_name": "string",
  "price": "decimal",
  "quantity": "integer",
  "base_color": "string",
  "customization_text": "string",
  "design_image_url": "base64_string"
}
```

#### **Remove from Cart**
- **DELETE** `/api/cart/{id}/`
- **Headers**: `Authorization: Bearer {access_token}`

#### **Clear Cart**
- **DELETE** `/api/cart/clear/`
- **Headers**: `Authorization: Bearer {access_token}`

### **Orders**

#### **Get User Orders**
- **GET** `/api/orders/`
- **Headers**: `Authorization: Bearer {access_token}`
- **Response**: Array of order objects with items

#### **Create Order from Cart**
- **POST** `/api/orders/create_from_cart/`
- **Headers**: `Authorization: Bearer {access_token}`
- **Body**: `{ "payment_intent_id": "string", "coupon_code": "string" }`
- **Response**: Order object with items

### **Payment**

#### **Create Payment Intent**
- **POST** `/api/checkout/pay/`
- **Headers**: `Authorization: Bearer {access_token}`
- **Body**: `{ "amount": "float", "coupon_code": "string" }`
- **Response**: `{ "clientSecret": "string", "paymentIntentId": "string" }`

### **Coupons**

#### **Preview Coupon**
- **POST** `/api/preview_coupon/`
- **Headers**: `Authorization: Bearer {access_token}`
- **Body**: `{ "coupon_code": "string", "cart_total": "decimal" }`
- **Response**: `{ "valid": true, "discount_percent": 10, "discount_amount": 100 }`

---

## Business Concept Summary

**CustomKeeps** is a print-on-demand e-commerce platform that empowers Filipino young adults, students, small groups, and SMEs to create affordable, personalized merchandise without minimum order requirements.

### **Target Market**
- **Primary**: Young adults aged 18-30 in Metro Manila and major Philippine cities, middle-income bracket (₱15,000-₱40,000/month), seeking personalized keepsakes and gifts
- **Secondary**: Small groups, clubs, and SMEs (10-50 members) needing small-batch branded merchandise

### **Value Proposition**
CustomKeeps addresses the gap in the Philippine market where traditional print shops require high minimum orders, making them impractical for individuals or small groups. The platform offers:
- **No Minimum Orders**: Single-item purchases accepted
- **Affordable Pricing**: Pay-per-use model with tiered pricing for bulk orders
- **Easy Customization**: User-friendly design tools without complex software
- **Fast & Reliable**: Local production with predictable delivery
- **Sustainable Options**: Eco-friendly materials available

### **Revenue Model**
- Pay-per-use transactions (primary revenue)
- 10-15% commission on partner creator designs
- Subscription plan (CustomKeeps Plus at ₱149/month) with perks like free shipping and exclusive templates

---

## Known Issues & Limitations

### **Current Limitations**
1. **Design Upload Only**: Users must upload pre-made designs (JPG/PNG). No built-in drag-and-drop designer yet
2. **Base64 Image Storage**: Design images stored as base64 in database instead of file storage (scalability concern for large files)
3. **No Image Optimization**: Uploaded images not compressed, potentially affecting load times
4. **Single Currency**: Only supports PHP (₱), no multi-currency support
5. **No Product Categories**: Products not organized into categories (t-shirts, mugs, etc.)
6. **Limited Order Status Updates**: Order status must be manually updated via admin panel
7. **No Real-time Notifications**: Order status changes not sent via email/SMS
8. **No Product Reviews**: Users cannot review or rate products
9. **Fixed Product Prices**: Prices are hardcoded per product, no dynamic pricing based on customization complexity

### **Known Bugs**
- **Cart Persistence**: Cart clears after successful payment even if user navigates back
- **Token Expiry**: No automatic token refresh on 401 errors (users must manually re-login)
- **Coupon Case Sensitivity**: Coupon codes are case-insensitive in backend but frontend displays them as entered

### **Security Considerations**
- CORS configured for specific origins (localhost, Vercel domain)
- JWT tokens stored in localStorage (vulnerable to XSS attacks - should use httpOnly cookies)
- Stripe test mode keys included in documentation (production keys must be secured)

---

## GC2 → Final Project Changelog

### **Major Tech Stack Changes**

#### **Backend Migration: Node.js → Django**
**Original GC2 Plan**: Node.js + Express + MongoDB  
**Final Implementation**: Django + Django REST Framework + PostgreSQL

**Reasons for Change**:
- **Stronger Authentication**: Django's built-in user model + SimpleJWT provided more secure authentication out-of-the-box
- **Admin Interface**: Django Admin offered immediate product/order management without custom admin panel development
- **Relational Data**: PostgreSQL better suited for e-commerce transactions requiring ACID compliance
- **Team Familiarity**: Members were already familiar with Django, reducing learning curve

**Impact**: 
- Faster backend development due to Django's batteries-included approach
- Built-in ORM simplified database operations
- Lost MongoDB flexibility for design storage (now using base64 text fields)

#### **Frontend: React Native → React (Web Only)**
**Original GC2 Plan**: React.js for web + React Native for mobile app  
**Final Implementation**: React.js with Vite (web-only)

**Reasons for Change**:
- **Time Constraints**: Developing both web and mobile exceeded project timeline
- **Focus on Core Features**: Prioritized polished web experience over multi-platform support
- **Responsive Design**: Mobile-optimized web UI provided acceptable mobile experience

### **Major Feature Changes**

#### **Added Features** (Not in GC2 MVP)
1. **Dynamic Coupon System**
   - Admin-managed discount codes with validity periods
   - Real-time coupon preview before checkout
   - Applied discounts tracked per order

2. **Hold-to-Pay UX**
   - Interactive 1.5-second hold button for payment confirmation
   - Progress bar visual feedback
   - Reduces accidental payments

3. **Cart Duplicate Detection**
   - Merges identical items (same product + customization) by incrementing quantity
   - Prevents cart clutter

4. **Enhanced Admin Interface**
   - django-admin-interface package for modern UI
   - Image preview thumbnails in admin panel
   - Order status management with inline items

5. **Order History Page**
   - Detailed order cards with status badges
   - Item-level customization display
   - Date and payment tracking

#### **Removed/Deferred Features** (Planned in GC2 Phase 2)
1. **Drag-and-Drop Designer**: Users must upload pre-made designs instead
2. **AI Recommendation Engine**: No personalized product suggestions
3. **Loyalty/Referral Program**: Points system not implemented
4. **Social Login**: No Google/Facebook authentication
5. **Real-time Order Tracking**: No logistics API integration
6. **Push Notifications**: No mobile notifications or email automation
7. **Subscription Plan**: CustomKeeps Plus membership not implemented
8. **Mobile App**: React Native app not developed

### **Architecture Changes**

#### **Database Structure**
**GC2 Plan**: MongoDB with flexible schema  
**Final**: PostgreSQL with Django ORM

**Models Added**:
- `Coupon` model for dynamic discount management
- `CartItem` model for persistent shopping cart
- `OrderItem` model for line-item storage
- Foreign key relationships (User → Order → OrderItem)

**Key Difference**: Design images stored as TextField (base64) instead of file references or GridFS

#### **Payment Flow**
**GC2 Plan**: Simulated payment with mock integration  
**Final**: Full Stripe integration with PaymentIntent API

**Implementation**:
- Stripe Elements for card input
- Backend creates PaymentIntent with amount + coupon
- Frontend confirms payment and triggers order creation
- Payment metadata includes user ID and coupon code

#### **Deployment**
**GC2 Plan**: Suggested Heroku/AWS/DigitalOcean  
**Final**: Render (backend) + Vercel (frontend)

**Reasons**:
- Free tiers available for student projects
- Automatic deployment via GitHub integration
- PostgreSQL included with Render
- CDN and serverless functions on Vercel

### **Code Organization Improvements**

1. **API Service Abstraction**
   - Centralized `apiService.js` for all backend calls
   - Consistent JWT token handling
   - Error handling standardization

2. **Component Modularity**
   - Separated Cart, Payment, CustomizationForm into reusable components
   - OrderContext for state management
   - Page-level components (CartPage, OrdersPage) for routing

3. **Django App Structure**
   - Single `api` app for all endpoints
   - Serializers for model validation
   - ViewSets for RESTful CRUD operations
   - Custom actions (`create_from_cart`, `clear` cart)

4. **Environment Configuration**
   - `.env` files for sensitive credentials
   - Vite's `import.meta.env` for frontend
   - Django's `python-dotenv` for backend
   - Separate dev/prod settings

---

## AI Usage Disclosure

This project was developed with assistance from **Perplexity AI** and other AI tools for the following purposes:

### **Code Development Assistance**
- **Backend API Design**: AI helped structure Django REST Framework views, serializers, and URL routing patterns
- **Stripe Integration**: Guidance on implementing Stripe PaymentIntent flow in Django and React
- **JWT Authentication**: Assistance with djangorestframework-simplejwt configuration and token refresh logic
- **React Component Structure**: Suggestions for component organization and state management patterns
- **Error Handling**: Best practices for API error responses and frontend error display

### **Debugging & Problem-Solving**
- **CORS Issues**: Resolved cross-origin errors between Vercel frontend and Render backend
- **Stripe Test Mode**: Troubleshot PaymentIntent confirmation errors
- **Base64 Image Handling**: Implemented design image upload and storage strategy
- **Cart Duplication Logic**: Developed algorithm for detecting and merging identical cart items
- **Deployment Configuration**: Fixed static file serving with WhiteNoise and build commands

### **Learning Outcomes**
While AI accelerated development, the core understanding of Django REST Framework, React patterns, JWT authentication, and Stripe integration was achieved through hands-on implementation and debugging. AI served as a mentor/reference guide rather than a replacement for learning.

---

**Project Team**: Ethan Aquino, Arianna Chan, Paul Kim, Harmonie Lin, Luis Quintos

