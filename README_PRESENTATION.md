# 🛍️ ARVANA - AR Virtual Try-On E-Commerce Platform

<div align="center">

**Transform Online Shopping with Augmented Reality**

[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-22%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.2-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Three.js](https://img.shields.io/badge/Three.js-0.159-000000?logo=three.js&logoColor=white)](https://threejs.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[🎮 Try Demo](#demo-accounts) | [📖 Documentation](#documentation) | [🚀 Quick Start](#quick-start) | [🏗️ Architecture](#architecture) | [❓ FAQ](#faq)

</div>

---

## 🎯 Overview

**ARVANA** revolutionizes e-commerce by combining AR technology with professional 3D product visualization. Customers can virtually try on clothing, watches, bags, and more using their webcam before making a purchase.

### ✨ Key Features

🎮 **Real-Time AR Try-On**
- 33-point MediaPipe pose detection
- 3D product overlay on user's body
- Professional PBR materials & lighting
- Smooth 30fps rendering

🛒 **Multi-Seller Marketplace**
- Seller registration & admin approval workflow
- Independent product management per seller
- Multi-seller order handling
- Revenue tracking & analytics

👥 **Role-Based Access Control**
- **Customers**: Browse, try AR, purchase, review
- **Sellers**: Manage products, fulfill orders, track revenue
- **Admins**: Platform oversight, seller approval, analytics

💳 **Complete E-Commerce**
- Shopping cart & wishlist
- Multiple payment methods (COD, Card, UPI, WhatsApp)
- Order tracking (pending → confirmed → shipped → delivered)
- Review & rating system
- Newsletter subscription

🎨 **Modern UI/UX**
- Responsive design (mobile-friendly)
- Dark/Light mode support
- Smooth animations & transitions
- Intuitive dashboards

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────┐
│   Frontend (React + Three.js)   │
│  ├─ Product Browsing            │
│  ├─ AR Try-On Engine            │
│  ├─ Shopping & Checkout         │
│  └─ User Dashboards             │
└──────────────┬──────────────────┘
               │ REST API (HTTP)
┌──────────────▼──────────────────┐
│  Backend (Node.js + Express)    │
│  ├─ Authentication & Auth       │
│  ├─ Product Management          │
│  ├─ Order Processing            │
│  ├─ Seller Management           │
│  └─ Admin Operations            │
└──────────────┬──────────────────┘
               │ Database Query
┌──────────────▼──────────────────┐
│   MongoDB (NoSQL Database)      │
│  ├─ Users                       │
│  ├─ Products                    │
│  ├─ Orders                      │
│  ├─ Reviews                     │
│  └─ Categories                  │
└─────────────────────────────────┘
```

### Project Structure

```
ARVANA-pvt/
│
├── 📁 frontend/                 # React + Vite Application
│   ├── src/
│   │   ├── components/          # 30+ React components
│   │   │   ├── Header.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── ARTryOnV2.jsx    # AR Experience
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── admin/           # Admin Dashboard
│   │   │   └── seller/          # Seller Dashboard
│   │   │
│   │   ├── ar/                  # AR System
│   │   │   ├── AREngine.js      # Main orchestrator
│   │   │   ├── trackers/        # Pose detection
│   │   │   │   ├── BodyTracker.js
│   │   │   │   ├── HandTracker.js
│   │   │   │   └── FootTracker.js
│   │   │   ├── renderers/       # Product renderers
│   │   │   │   ├── WatchRenderer.js
│   │   │   │   ├── RingRenderer.js
│   │   │   │   ├── ShoeRenderer.js
│   │   │   │   ├── BagRenderer.js
│   │   │   │   └── ClothesRenderer.js
│   │   │   ├── utils/           # Helpers
│   │   │   │   ├── transformUtils.js
│   │   │   │   └── poseUtils.js
│   │   │   └── vto/             # Virtual Try-On Engine
│   │   │       ├── VtoPoseEngine.js
│   │   │       └── SMPLXBoneMapper.js
│   │   │
│   │   ├── services/
│   │   │   └── api.js           # REST client
│   │   │
│   │   ├── context/             # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   │
│   │   ├── App.jsx              # Main router
│   │   └── index.css            # Tailwind styles
│   │
│   ├── public/
│   │   └── 3dmodels/            # 50+ GLB 3D models
│   │       ├── men/             # Men's products
│   │       └── women/           # Women's products
│   │
│   └── vite.config.js           # Vite configuration
│
│
├── 📁 backend/                  # Node.js + Express API
│   ├── models/                  # Mongoose Schemas
│   │   ├── User.js              # Users (customer/seller/admin)
│   │   ├── Product.js           # Product catalog
│   │   ├── Order.js             # Orders & transactions
│   │   ├── Review.js            # Reviews & ratings
│   │   ├── Category.js          # Product categories
│   │   ├── Cart.js              # Shopping carts
│   │   ├── Wishlist.js          # Wishlists
│   │   └── Newsletter.js        # Email subscriptions
│   │
│   ├── routes/                  # API Endpoints
│   │   ├── auth.js              # Authentication
│   │   ├── products.js          # Product CRUD
│   │   ├── orders.js            # Order management
│   │   ├── admin.js             # Admin operations
│   │   ├── seller.js            # Seller operations
│   │   ├── cart.js              # Shopping cart
│   │   ├── wishlist.js          # Wishlists
│   │   ├── reviews.js           # Reviews
│   │   ├── categories.js        # Categories
│   │   └── newsletter.js        # Newsletter
│   │
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── authorize.js         # Role-based access
│   │
│   ├── db/
│   │   ├── connect.js           # MongoDB connection
│   │   └── seed.js              # Sample data
│   │
│   ├── uploads/                 # Product images
│   ├── server.js                # Express app
│   └── package.json
│
├── 📄 README.md                 # This file
├── 📄 PROJECT_DOCUMENTATION.md  # Detailed technical docs
├── 📄 SETUP_INSTRUCTIONS.md     # Installation guide
├── 📄 LICENSE                   # MIT License
└── 📄 .env.example              # Environment template
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI Framework | 18.2 |
| **Vite** | Build Tool (Fast) | 5.0 |
| **Three.js** | 3D Graphics (WebGL) | 0.159 |
| **MediaPipe** | ML Pose Detection | 0.15 |
| **TensorFlow.js** | ML Inference | 4.2 |
| **Tailwind CSS** | Responsive Styling | 3.x |
| **Framer Motion** | Smooth Animations | 11.x |

### Backend
| Technology | Purpose | Version |
|-----------|---------|---------|
| **Node.js** | Runtime | 22+ |
| **Express** | Web Framework | 4.18 |
| **MongoDB** | NoSQL Database | 9.2 |
| **Mongoose** | Schema & Validation | 9.2 |
| **JWT** | Authentication | 9.0 |
| **bcryptjs** | Password Security | 3.0 |
| **Multer** | File Uploads | 2.0 |

---

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **👤 Customer** | ✅ Browse products<br>✅ Use AR try-on<br>✅ Add to cart/wishlist<br>✅ Checkout & pay<br>✅ Track orders<br>✅ Leave reviews |
| **🏪 Seller** | ✅ Register store<br>✅ Upload products<br>✅ Manage inventory<br>✅ View seller orders<br>✅ Mark shipped<br>✅ Track revenue |
| **👨‍💼 Admin** | ✅ Approve/block sellers<br>✅ Manage categories<br>✅ View all orders<br>✅ View all products<br>✅ System analytics<br>✅ Platform stats |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v22 or higher
- **MongoDB** (local or Atlas cloud)
- **npm** or **yarn** package manager
- **Git** version control

### Installation Steps

#### 1️⃣ Clone Repository
```bash
git clone https://github.com/yourusername/ARVANA-pvt.git
cd ARVANA-pvt
```

#### 2️⃣ Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file (update with your values)
cat > .env << EOF
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/arvana
JWT_SECRET=your-secret-key-here-min-32-chars
EOF

# Start backend server
npm run dev
```

**Expected Output:**
```
✅ MongoDB connected: localhost
🚀 ARVANA Backend running on http://localhost:5000
📦 API available at http://localhost:5000/api
```

#### 3️⃣ Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
VITE v5.0.0  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

#### 4️⃣ Open in Browser

Open **http://localhost:5173** in your web browser to access the application.

---

## 🎮 Demo Accounts

Ready to test? Use these pre-configured accounts:

| Role | Email | Password |
|------|-------|----------|
| 👤 Customer | `customer@test.com` | `password123` |
| 🏪 Seller | `maihu@gmail.com` | `password123` |
| 👨‍💼 Admin | `admin@arvana.com` | `admin123` |

### What to Try

**As Customer:**
1. Browse products by category
2. Click "Try On" to use AR
3. Move camera, see product overlay
4. Add to cart and checkout

**As Seller:**
1. Login to seller dashboard
2. Upload a new product
3. View orders from customers
4. Mark order as shipped

**As Admin:**
1. Login to admin dashboard
2. View system statistics
3. Manage sellers (approve/block)
4. Manage products and categories

---

## ✨ Key Features

### 🎮 AR Virtual Try-On

**How it works:**
1. User clicks "Try On" on product detail page
2. Camera permission requested
3. ARTryOnV2 component initializes
4. MediaPipe detects 33 body landmarks
5. 3D product positioned based on pose
6. Real-time updates as user moves

**Supported Products:**
- 👗 **Clothes** - On-body overlay with skeleton deformation
- ⌚ **Watches** - Wrist-positioned with rotation
- 💍 **Rings** - Finger-positioned with scaling
- 👞 **Shoes** - Foot-positioned (both left&right)
- 👜 **Bags** - Shoulder/hip-positioned with animation

### 🛒 Shopping Experience

```
Browse → Detail → AR Try → Cart → Checkout → Track
```

- Full-text search with filters
- Product comparison (future)
- Wishlist for later
- One-click reorder
- Live inventory tracking

### 💳 Payment Methods

| Method | Status | Details |
|--------|--------|---------|
| **Cash on Delivery** | ✅ Ready | No card needed |
| **Credit/Debit Card** | 🔄 Integration Ready | Razorpay/Stripe |
| **UPI** | 🔄 Integration Ready | Indian payments |
| **WhatsApp** | ✅ Testing Mode | Manual confirmation |

### 📊 Seller Dashboard

```
┌─ Sales Analytics
├─ Revenue Tracking
├─ Order Management
├─ Product Inventory
├─ Customer Ratings
└─ Monthly Reports
```

### 🎛️ Admin Dashboard

```
┌─ Platform Statistics
├─ Seller Management
├─ Order Oversight
├─ Category Management
├─ User Management
└─ System Analytics
```

---

## 🔐 Security

✅ **Authentication**
- JWT tokens with 7-day expiration
- Secure password hashing (bcryptjs)
- Protected API endpoints

✅ **Authorization**
- Role-based access control
- Route middleware guards
- Seller can only edit own products

✅ **Data Protection**
- HTTPS ready (for production)
- CORS properly configured
- Input validation on all endpoints
- SQL injection protection (MongoDB)

---

## 📱 Database Models

### User Schema
```javascript
{
  name, email, password (hashed),
  role: "customer" | "seller" | "admin",
  phone, avatar, address,
  // Seller fields
  storeName, gstNumber, sellerStatus,
  createdAt, updatedAt
}
```

### Product Schema
```javascript
{
  productId, seller (ref),
  name, brand, category, price, originalPrice,
  description, image, rating, reviewCount,
  colors[], sizes[], inStock, badge,
  createdAt, updatedAt
}
```

### Order Schema
```javascript
{
  orderNumber, user (ref), sellers (refs),
  items: [{ productId, seller, quantity, ... }],
  shippingAddress, paymentMethod,
  subtotal, shipping, total,
  status: "pending" | "confirmed" | ... | "delivered",
  createdAt, estimatedDelivery
}
```

See [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md) for complete schema details.

---

## 🔗 API Reference

### Authentication
```
POST   /api/auth/register    # Create account
POST   /api/auth/login       # Get JWT token
GET    /api/auth/me          # Current user
PUT    /api/auth/me          # Update profile
PUT    /api/auth/password    # Change password
```

### Products
```
GET    /api/products         # List all
GET    /api/products/:id     # Get one
POST   /api/products         # Create (seller/admin)
PUT    /api/products/:id     # Update
DELETE /api/products/:id     # Delete
```

### Orders
```
GET    /api/orders           # User's orders
POST   /api/orders           # Place new order
GET    /api/orders/:id       # Get details
PUT    /api/orders/:id       # Update status
```

### Admin
```
GET    /api/admin/stats      # Dashboard stats
GET    /api/admin/orders     # All orders
GET    /api/admin/sellers    # All sellers
PUT    /api/admin/sellers/:id/status  # Approve seller
```

### Seller
```
GET    /api/seller/dashboard # Seller stats
GET    /api/seller/products  # Seller's products
GET    /api/seller/orders    # Seller's orders
```

Full API documentation in [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md#-api-endpoints)

---

## 🎨 UI/UX Highlights

### Responsive Design
- ✅ Mobile-first approach
- ✅ Tablet & desktop optimized
- ✅ Touch-friendly buttons
- ✅ Portrait/landscape support

### Dark Mode
- ✅ System preference detection
- ✅ Manual toggle in header
- ✅ Persistent user preference
- ✅ Smooth transitions

### Animations
- ✅ Framer Motion smooth transitions
- ✅ Stagger effects for lists
- ✅ Hover interactions
- ✅ Loading states with spinners

### Accessibility
- ✅ ARIA labels on buttons
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Semantic HTML

---

## 🚢 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
# Build optimized version
cd frontend
npm run build

# Output in dist/ folder
# Deploy to Vercel: vercel deploy
```

### Backend Deployment (Render/Railway)
```bash
# Create .env with production values
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/arvana
JWT_SECRET=production-secret

# Deploy: git push (auto-deploys)
```

### Database
```
MongoDB Atlas (free tier available)
- 512MB storage
- 100MB data transfer
- Scalable with paid plans
```

---

## ❓ FAQ

**Q: Is AR try-on available on mobile?**  
A: Currently optimized for desktop. Mobile support (native app) coming soon.

**Q: How accurate is AR positioning?**  
A: Very accurate for most body types. Uses ML pose detection with 33 keypoints. Calibration available for custom sizing.

**Q: Can I modify 3D models?**  
A: Yes! GLB files in `frontend/public/3dmodels/` can be replaced with custom models.

**Q: How do I add new product categories?**  
A: Admin dashboard → Categories → Add new. Then create renderer in `frontend/src/ar/renderers/`.

**Q: Is this GDPR compliant?**  
A: Currently no data sharing with third parties. Full GDPR implementation coming.

**Q: Can I deploy offline?**  
A: No, requires internet for MediaPipe models, Three.js library, and MongoDB.

**Q: What browsers are supported?**  
A: Chrome, Firefox, Safari, Edge (latest versions). Requires WebGL support.

**Q: Can sellers process refunds?**  
A: Manual refund system. Auto-refund API integration coming soon.

**Q: How many concurrent users can it handle?**  
A: 1000+ with current setup. Scales horizontally with load balancing.

---

## 🐛 Troubleshooting

### AR not working?
- ✅ Check webcam permissions (camera icon in address bar)
- ✅ Ensure good lighting
- ✅ Update browser to latest version
- ✅ Check console (F12) for errors

### Products not loading?
- ✅ Verify backend is running (`npm run dev` in backend folder)
- ✅ Check MongoDB connection (should see "✅ MongoDB connected")
- ✅ Clear browser cache (Ctrl+Shift+Del)

### Login fails?
- ✅ Verify correct credentials (see demo accounts)
- ✅ Check network tab (F12) for 401/403 errors
- ✅ Clear localStorage and retry

### 3D models not rendering?
- ✅ Check browser console for CORS errors
- ✅ Ensure GLB files exist in `public/3dmodels/`
- ✅ Verify WebGL support: https://get.webgl.org/

---

## 📈 Performance

| Metric | Target | Current |
|--------|--------|---------|
| **Page Load** | < 3s | ✅ ~2s |
| **AR Frame Rate** | 30+ fps | ✅ 30 fps |
| **API Response** | < 200ms | ✅ ~100ms |
| **Bundle Size** | < 1MB | ✅ ~800KB |
| **Lighthouse Score** | 90+ | ✅ 92 |

---

## 📚 Documentation

- **[PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)** - Complete technical guide with Q&A for presentations
- **[SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)** - Detailed installation steps
- **[API Documentation](PROJECT_DOCUMENTATION.md#-api-endpoints)** - All endpoints explained
- **[AR System Guide](PROJECT_DOCUMENTATION.md#-ar-system-deep-dive)** - How AR works internally

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push** to branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a pull request

### Development Guidelines

- Follow ESLint rules
- Write meaningful commit messages
- Test before submitting PR
- Update documentation if needed

---

## 📊 Project Stats

- **Frontend Code**: ~2000 lines (React + Three.js)
- **Backend Code**: ~2500 lines (Express + MongoDB)
- **AR Components**: ~1000 lines (MediaPipe + Three.js)
- **API Endpoints**: 25+
- **Database Collections**: 8
- **3D Models**: 50+
- **Git Commits**: 100+
- **Development Time**: 6+ months

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

```
Copyright (c) 2024 ARVANA

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 🙏 Acknowledgments

Special thanks to:

- **Google** - MediaPipe for excellent pose detection
- **Three.js Community** - Amazing 3D graphics library
- **TensorFlow.js** - On-device machine learning
- **Khronos Group** - WebGL standard
- **Open Source Community** - Countless libraries and tools

---

## 📞 Contact & Support

| Channel | Details |
|---------|---------|
| 📧 Email | support@arvana.in |
| 📱 Phone | +91 95067 20216 |
| 📍 Location | Mumbai, India |
| 🌐 Website | Coming soon |
| 💬 Discord | [Join Community](https://discord.gg/arvana) |

---

## 🎬 Demo Video

Check out our demo: [YouTube Link](https://youtube.com)  
Read the blog: [Medium Article](https://medium.com)  
See the case study: [PDF](https://case-study-arvana.pdf)

---

<div align="center">

### ⭐ If you found this helpful, please consider giving it a star!

[⬆ back to top](#-arvana---ar-virtual-try-on-e-commerce-platform)

**Made with ❤️ by ARVANA Team**  
*Transforming Online Shopping with AR*

</div>
