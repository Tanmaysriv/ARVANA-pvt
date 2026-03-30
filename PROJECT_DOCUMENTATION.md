# 📚 ARVANA Project Documentation
## Comprehensive Technical Guide & Presentation Guide

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Design](#architecture--design)
3. [Technology Stack](#technology-stack)
4. [Database Design](#database-design)
5. [API Endpoints](#api-endpoints)
6. [AR System Deep Dive](#ar-system-deep-dive)
7. [User Workflows](#user-workflows)
8. [Authentication & Authorization](#authentication--authorization)
9. [Features Implementation](#features-implementation)
10. [Presentation Q&A Guide](#presentation-qa-guide)

---

## 🎯 Project Overview

**ARVANA** (Augmented Reality Virtual Try-On E-Commerce) is a full-stack web application that revolutionizes online shopping by allowing customers to virtually try on products using their webcam and AR technology before making a purchase.

### Key Highlights

- **AR Virtual Try-On**: Real-time 3D product overlay on user's body using MediaPipe pose detection
- **Multi-Seller Marketplace**: Multiple vendors can list products with independent inventory
- **Role-Based Access Control (RBAC)**: Three distinct user roles with granular permissions
- **Professional Dashboard System**: Separate dashboards for admin, sellers, and customers
- **Real-Time Pose Tracking**: 33-point body pose detection with smooth bone animation
- **3D Product Catalog**: GLB models with PBR materials and realistic renderings

### Business Model

```
Customers                 Sellers              Admin
     ↓                       ↓                    ↓
  Browse & AR Try-On  →  Manage Products   →  Oversee Platform
     ↓                       ↓                    ↓
  Add to Cart          Track Orders     Approve Sellers
     ↓                       ↓                    ↓
  Checkout            Fulfill Orders    Analytics & Reports
     ↓
  Track Order
```

---

## 🏗️ Architecture & Design

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER INTERFACE LAYER                 │
│  React 18 + Vite + Three.js + Tailwind CSS + Framer    │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Components: Header, Hero, AR Try-On, Cart, etc.  │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │ REST API (HTTP/JSON)
                     ↓
┌─────────────────────────────────────────────────────────┐
│                    API GATEWAY LAYER                    │
│              Express.js (Node.js Runtime)               │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Routes: /api/products /api/orders /api/auth      │   │
│  │ Middleware: JWT Auth, CORS, Multer (uploads)    │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │ Query/Commands
                     ↓
┌─────────────────────────────────────────────────────────┐
│                  BUSINESS LOGIC LAYER                   │
│  Mongoose ODM + MongoDB Schemas + Controllers           │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Auth Logic, Product CRUD, Order Processing       │   │
│  │ Seller Approval, Payment Handling                │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │ Queries
                     ↓
┌─────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                       │
│     MongoDB Atlas (Cloud-based NoSQL Database)          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Collections: Users, Products, Orders, Reviews... │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Frontend Architecture

```
App.jsx (Main Router)
├── Components/
│   ├── Header (Navigation, Auth, Cart)
│   ├── Hero (Landing Banner)
│   ├── ARTryOnV2 (AR Experience Engine)
│   ├── ProductDetail (Single Product Page)
│   ├── CategoryPage (Products by Category)
│   ├── Cart/Checkout (Purchasing Flow)
│   └── Admin/ & Seller/ (Dashboard Components)
├── Services/
│   └── api.js (REST Client)
├── Context/
│   ├── AuthContext (User & Login State)
│   ├── CartContext (Shopping Cart State)
│   └── ThemeContext (Dark/Light Mode)
└── AR Engine/
    ├── AREngine.js (Orchestrator)
    ├── Trackers/ (Pose Detection)
    ├── Renderers/ (Product 3D Models)
    └── Utils/ (Coordinate Mapping)
```

### Backend Architecture

```
server.js (Express App)
├── Routes/
│   ├── auth.js (Login, Register, Profile)
│   ├── products.js (CRUD Operations)
│   ├── orders.js (Order Management)
│   ├── admin.js (Admin Operations)
│   ├── seller.js (Seller Operations)
│   └── [cart, wishlist, reviews, etc.]
├── Models/
│   ├── User.js (Customers, Sellers, Admins)
│   ├── Product.js (Items in Catalog)
│   ├── Order.js (Purchases & Transactions)
│   ├── Review.js (Product Reviews)
│   └── [Category, Wishlist, Newsletter]
├── Middleware/
│   ├── auth.js (JWT Verification)
│   └── authorize.js (Role-based Access)
└── DB/
    ├── connect.js (MongoDB Connection)
    └── seed.js (Initial Data)
```

---

## 🛠️ Technology Stack

### Frontend Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **UI Framework** | React | 18.2 | Component-based UI |
| **Build Tool** | Vite | 5.0 | Fast development & production builds |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS |
| **Animations** | Framer Motion | 11.x | Smooth UI transitions |
| **3D Graphics** | Three.js | 0.159 | WebGL rendering |
| **Pose Detection** | MediaPipe | 0.15 | ML-based tracking |
| **ML/AI** | TensorFlow.js | 4.2 | On-device ML inference |
| **HTTP Client** | Fetch API | Native | REST API communication |
| **Icons** | Lucide React | Latest | UI Icons |

### Backend Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Runtime** | Node.js | 22+ | JavaScript engine |
| **Framework** | Express | 4.18 | Web server & routing |
| **Database** | MongoDB | 9.2 | NoSQL document store |
| **ODM** | Mongoose | 9.2 | MongoDB schema & validation |
| **Authentication** | JWT | 9.0 | Token-based auth |
| **Password Hashing** | bcryptjs | 3.0 | Secure password storage |
| **File Upload** | Multer | 2.0 | Handle file uploads |
| **HTTP Layer** | CORS | 2.8 | Cross-origin requests |

### Infrastructure

| Component | Details |
|-----------|---------|
| **Database Hosting** | MongoDB Atlas (Cloud) |
| **API Server** | Local development (Node.js) |
| **Version Control** | Git/GitHub |
| **Package Manager** | npm |

---

## 💾 Database Design

### Schema Relationships Diagram

```
User (admin/customer/seller)
├── id, name, email, passwordHash, role
├── address (embedded)
├── sellerStatus (if seller: pending/approved/blocked)
└── timestamps

           ↓
      ┌────┴────┐
      ↓         ↓
   Product     Order
  (catalog)  (purchases)
  ├─ id       ├─ id
  ├─ seller   ├─ user → User
  ├─ name     ├─ sellers → [User]
  ├─ price    ├─ items (line items)
  │ ...       ├─ status
  └─ rating   ├─ total
              └─ timestamps
              
              ↓
         ┌─────┴─────┐
         ↓           ↓
      Review      Cart/Wishlist
   ├─ product   ├─ productId
   ├─ user      ├─ userId
   ├─ rating    ├─ quantity
   └─ comment   └─ createdAt
```

### Core Collections

#### 1. **User Collection**

```javascript
{
  _id: ObjectId,
  name: "John Doe",
  email: "john@example.com",
  passwordHash: "bcrypt(password)",
  phone: "+91 9506720216",
  role: "customer" | "seller" | "admin",
  
  // Seller Fields
  storeName: "John's Store",
  storeDescription: "Premium Fashion",
  gstNumber: "27XXXXX1234",
  sellerStatus: "pending" | "approved" | "blocked",
  
  // Address
  address: {
    street: "123 Main St",
    city: "Mumbai",
    state: "MH",
    pincode: "400001",
    country: "India"
  },
  
  avatar: "profile_pic_url",
  createdAt: ISODate,
  updatedAt: ISODate
}
```

#### 2. **Product Collection**

```javascript
{
  productId: 1,
  seller: ObjectId, // Reference to User (seller)
  name: "Nike Air Max 270",
  brand: "Nike",
  category: "shoes" | "bags" | "clothes" | "watches",
  price: 10799,
  originalPrice: 12999,
  
  description: "Comfortable running shoes...",
  image: "https://cdn.example.com/shoe.jpg",
  
  colors: ["Black", "White", "Red"],
  sizes: ["7", "8", "9", "10", "11", "12"],
  
  rating: 4.7,
  reviewCount: 234,
  badge: "Bestseller",
  
  inStock: true,
  createdAt: ISODate,
  updatedAt: ISODate
}
```

#### 3. **Order Collection**

```javascript
{
  orderNumber: "ORD-2026-001234",
  user: ObjectId, // Reference to Customer
  sellers: [ObjectId, ObjectId, ...], // Multiple sellers
  
  items: [
    {
      productId: "1",
      seller: ObjectId,
      name: "Nike Shoe",
      price: 10799,
      quantity: 1,
      size: "10",
      color: "Black"
    }
  ],
  
  shippingAddress: {
    fullName: "John Doe",
    phone: "+91 9506720216",
    street: "123 Main St",
    city: "Mumbai",
    state: "MH",
    pincode: "400001",
    country: "India"
  },
  
  paymentMethod: "cod" | "card" | "upi" | "whatsapp",
  subtotal: 10799,
  shipping: 100,
  total: 10899,
  
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered",
  estimatedDelivery: ISODate,
  
  createdAt: ISODate,
  updatedAt: ISODate,
  deliveredAt: ISODate (when status = delivered)
}
```

#### 4. **Review Collection**

```javascript
{
  productId: ObjectId,
  userName: "John Doe",
  rating: 4.5,
  comment: "Great product, highly recommend!",
  createdAt: ISODate
}
```

---

## 🔗 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/register` | Create new account | ❌ |
| POST | `/login` | Login & get JWT token | ❌ |
| GET | `/me` | Get current user | ✅ |
| PUT | `/me` | Update profile | ✅ |
| PUT | `/password` | Change password | ✅ |

### Product Routes (`/api/products`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/` | List all products (with filters) | ❌ |
| GET | `/:id` | Get single product | ❌ |
| POST | `/` | Create product (seller/admin) | ✅ |
| PUT | `/:id` | Update product | ✅ (owner) |
| DELETE | `/:id` | Delete product | ✅ (seller/admin) |

### Order Routes (`/api/orders`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/` | Get user's orders | ✅ |
| GET | `/:id` | Get order details | ✅ |
| POST | `/` | Create new order | ✅ |
| PUT | `/:id` | Update order status | ✅ (seller/admin) |
| PATCH | `/:id/status` | Update order status | ✅ (seller/admin) |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/stats` | Dashboard statistics | ✅ (admin) |
| GET | `/orders` | All orders (admin view) | ✅ (admin) |
| GET | `/products` | All products (admin view) | ✅ (admin) |
| GET | `/sellers` | List all sellers | ✅ (admin) |
| PUT | `/sellers/:id/status` | Approve/Block seller | ✅ (admin) |
| POST | `/upload` | Upload image | ✅ (admin) |

### Seller Routes (`/api/seller`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/dashboard` | Seller statistics | ✅ (seller) |
| GET | `/products` | Seller's products | ✅ (seller) |
| GET | `/orders` | Seller's orders | ✅ (seller) |
| POST | `/products` | List new product | ✅ (seller) |
| PUT | `/products/:id` | Update product | ✅ (seller) |

### Cart Routes (`/api/cart`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/` | Get cart items | ❌ |
| POST | `/` | Add to cart | ❌ |
| DELETE | `/:id` | Remove from cart | ❌ |
| PUT | `/:id` | Update quantity | ❌ |

---

## 🎮 AR System Deep Dive

### What is AR Try-On?

Augmented Reality Try-On allows customers to:
1. Point webcam at themselves
2. See 3D products overlaid on their body
3. Move around to see realistic product placement
4. Make informed purchase decisions

### AR System Architecture

```
User Webcam
     ↓
┌──────────────────────────┐
│   MediaPipe Holistic     │ ← 33-point pose detection
│  (Body + Hand Tracking)  │
└──────────────┬───────────┘
               ↓
        (33 Landmarks)
         (x, y, z, conf)
               ↓
┌──────────────────────────┐
│  Coordinate Mapping      │ ← Transform to 3D space
│  (Normalize to frustum)  │
└──────────────┬───────────┘
               ↓
       (Transformed Points)
               ↓
┌──────────────────────────┐
│   Transform Utils        │ ← Calculate position/scale/rotation
│   (Per-category)         │
└──────────────┬───────────┘
               ↓
   (Target Position/Scale)
               ↓
┌──────────────────────────┐
│   Three.js Renderers     │ ← 5 Product Type Renderers
│  (Watch/Ring/Shoe/...)   │
└──────────────┬───────────┘
               ↓
        (3D Model Position)
               ↓
┌──────────────────────────┐
│   Three.js Scene         │ ← WebGL Rendering
│  (Lightning + Shadows)   │
└──────────────┬───────────┘
               ↓
       (3D Canvas Output)
               ↓
┌──────────────────────────┐
│   Canvas Composite       │ ← Overlay on video
│   (Final Output)         │
└──────────────────────────┘
```

### Components

#### 1. **AREngine.js** (Main Orchestrator)

```javascript
class AREngine {
  constructor(canvas, video, product) {
    // Initialize Three.js scene
    // Setup orthographic camera
    // Configure lighting & materials
    // Create product renderers
  }
  
  init() {
    // Initialize MediaPipe trackers
    // Setup pose detection
  }
  
  start() {
    // Main loop: detect pose → update position → render
    requestAnimationFrame(loop)
  }
}
```

**Key Features:**
- Orthographic camera (`[-aspect, +aspect, 1, -1]`)
- PBR materials with environment lighting
- Three-point lighting setup
- Real-time pose tracking at 30fps

#### 2. **Pose Trackers** (MediaPipe Integration)

**BodyTracker.js**
- Full-body pose detection (33 keypoints)
- Shoulder, spine, hip tracking
- Visibility confidence scores

**HandTracker.js**
- Hand landmark detection (21 points per hand)
- Wrist, finger, palm tracking
- Left/right hand differentiation

**FootTracker.js**
- Foot keypoint detection
- Ankle, heel, toe position

#### 3. **Product Renderers** (5 Types)

```javascript
// Each renderer handles specific product category:

WatchRenderer → Position on wrist
RingRenderer → Position on finger
ShoeRenderer → Position on feet (both left/right)
BagRenderer → Position at shoulder/hip
ClothesRenderer → Position on torso with SMPL skeleton
```

**Life Cycle:**
1. Load GLB model from `/public/3dmodels/`
2. Apply PBR materials
3. Position on detected body part
4. Animate bones if applicable
5. Render to Three.js scene

#### 4. **Coordinate Mapping System**

**MediaPipe Input Space:**
- X: 0 (left) to 1 (right)
- Y: 0 (top) to 1 (bottom)
- Z: 0 (far) to 1 (near)
- Video mirrored for selfie view

**Three.js Output Space:**
- X: -1.778 to 1.778 (aspect ratio)
- Y: -1 (bottom) to 1 (top)
- Z: ~0.5 (constant depth)
- Camera: Orthographic (-aspect, aspect, 1, -1)

**Transformation Formula:**
```javascript
// Normalize MediaPipe coords to Three.js
x_3d = (x_mp - 0.5) * aspectRatio * 2
y_3d = -(y_mp - 0.5) * 2  // Flip Y: canvas↓ → Three.js↑
z_3d = 0.5
```

### Key Technologies

| Tech | Purpose |
|------|---------|
| **MediaPipe Holistic** | ML-based 33-point pose estimation |
| **Three.js** | 3D WebGL rendering engine |
| **TensorFlow.js** | ML inference in browser |
| **Draco Compression** | Compress GLB models efficiently |
| **SMPL Skeleton** | Rigged human body model |

### Supported Products

1. **Watches** - Wrist-anchored, rotated by arm angle
2. **Rings** - Finger-anchored, scaled by finger length
3. **Shoes** - Foot-anchored, per-foot rendering
4. **Bags** - Shoulder/wrist-anchored, scaled by arm length
5. **Clothes** - Torso-anchored, deformed with skeleton bones

---

## 👥 User Workflows

### 1. Customer Journey

```
Browse Products
      ↓
   View Details
      ↓
   Try AR Virtual Try-On
      ↓
   Add to Cart
      ↓
   Checkout (Enter Address + Payment)
      ↓
   Place Order
      ↓
   Track Order (pending → confirmed → processing → shipped → delivered)
      ↓
   Leave Review/Rating
      ↓
   Reorder or Add to Wishlist
```

### 2. Seller Journey

```
Register as Seller
      ↓
   Shop Details (name, GST, description)
      ↓
   Admin Approves/Blocks (seller status)
      ↓
   Login to Seller Dashboard
      ↓
   Upload Products
      ↓
   View Orders from Customers
      ↓
   Fulfill & Mark as Shipped
      ↓
   Track Revenue & Sales
      ↓
   Manage Inventory
```

### 3. Admin Journey

```
Login to Admin Dashboard
      ↓
   View Platform Statistics
      ├─ Total Orders, Revenue, Users
      ├─ Order Status Distribution
      └─ Revenue Trends
      ↓
   Manage Categories
      ├─ Create, Edit, Delete
      └─ Assign Icons
      ↓
   Manage Products
      ├─ View All Products
      ├─ Edit/Delete
      └─ Monitor Stock
      ↓
   Manage Sellers
      ├─ View Pending Sellers
      ├─ Approve/Block
      └─ Track Revenue
      ↓
   Manage Orders
      ├─ View All Orders
      ├─ Update Status
      └─ Track Fulfillment
      ↓
   Generate Reports
```

---

## 🔐 Authentication & Authorization

### JWT-Based Authentication

```
User Login
    ↓
  Email + Password
    ↓
  Verify with bcrypt
    ↓
  Generate JWT Token
  {
    id: userId,
    exp: 7 days
  }
    ↓
  Store in localStorage
    ↓
  Include in Authorization Header
  "Bearer eyJhbGc..."
    ↓
  Middleware Verifies
    ↓
  Attach User to Request
```

### Authorization Levels

```javascript
// Middleware-based Access Control

@protect  // Only authenticated users
GET /api/orders

@protect
@authorize(['seller', 'admin'])  // Only sellers/admins
PUT /api/products/:id

@protect
@authorize(['admin'])  // Only admins
PUT /api/sellers/:id/status

// Public endpoints
GET /api/products  // No auth required
GET /api/categories
```

### Password Security

- **Hashing**: bcryptjs with salt rounds = 12
- **Storage**: Only hash stored, never plaintext
- **Comparison**: Compare candidate with bcrypt
- **Reset**: Temporary token via email (future feature)

---

## ✨ Features Implementation

### 1. **Product Browsing & Search**

```javascript
// Filters Available:
- Category (shoes, bags, clothes, watches)
- Price Range (min-max)
- Rating (stars)
- Brand
- Color
- Size
- Badge (Bestseller, New)
- Stock Status
```

**Database Query Example:**
```javascript
db.Product.find({
  category: { $regex: query, $options: 'i' },
  price: { $gte: minPrice, $lte: maxPrice },
  rating: { $gte: minRating }
}).sort({ createdAt: -1 }).limit(20)
```

### 2. **Shopping Cart**

```javascript
Cart Structure:
{
  userId: "guest" | "user_id",
  items: [
    {
      productId: 1,
      quantity: 2,
      selectedSize: "10",
      selectedColor: "Black"
    }
  ]
}

Operations:
- Add: Merge or increment quantity
- Remove: Delete item from array
- Update: Modify quantity or selections
- Clear: Empty cart
```

### 3. **Order Management**

**Order Statuses & Transitions:**

```
pending
   ↓
confirmed (customer confirms payment)
   ↓
processing (seller prepares)
   ↓
shipped (seller ships)
   ↓
delivered (customer receives)

Alternative: cancelled (any status → cancelled)
```

**Multi-Seller Orders:**
```javascript
Single Order can have items from Multiple Sellers
Example Order:
  items: [
    { seller: "Seller A", product: "Nike Shoe" },
    { seller: "Seller B", product: "Adidas Bag" }
  ],
  sellers: ["Seller A ID", "Seller B ID"]

Each seller sees only their items and can update status independently
```

### 4. **Seller Approval Workflow**

```
Seller Registration
     ↓
Status: "pending"
     ↓
Admin Reviews:
  ├─ GST Number Valid?
  ├─ Shop Description?
  └─ Other Credentials?
     ↓
Admin Approves
     ↓
Status: "approved"
     ↓
Seller Can List Products

or

Admin Blocks
   ↓
Status: "blocked"
   ↓
Seller Cannot Login/Sell
```

### 5. **Category Management**

```
Categories in System:
- shoes
- bags
- clothes
- watches
- (more can be added)

Each has:
- categoryId (unique)
- name
- icon (emoji for display)
- products count
```

### 6. **Reviews & Ratings**

```javascript
Review Schema:
{
  productId: "1",
  userName: "John Doe",
  rating: 4.5,  // 1-5 stars
  comment: "Great product!",
  createdAt: ISODate
}

Product Ratings:
- rating: average of all reviews
- reviewCount: total reviews
```

### 7. **Newsletter Subscription**

```javascript
Email Collection (optional):
{
  email: "user@example.com",
  subscribedAt: ISODate
}

Use Case: Marketing campaigns, product updates
```

---

## 💡 Presentation Q&A Guide

### Q1: **What is unique about ARVANA?**

**Answer:**
> "ARVANA solves the biggest challenge in online fashion: uncertainty about fit and appearance. While competitors show flat product photos, we use AR to let customers see 3D products on their own body in real-time. This reduces return rates, increases confidence, and improves sales conversion."

**Key Points:**
- Real-time 3D visualization
- 33-point pose tracking (not just basic filters)
- Professional PBR materials
- Multi-category support

---

### Q2: **How does the AR technology work?**

**Answer:**
> "Our AR system uses Google's MediaPipe to detect 33 body landmarks in real-time. These coordinates get mapped to a Three.js 3D scene with orthographic camera projection. We then position, scale, and rotate 3D product models based on detected body parts—wrist for watches, shoulder for clothes, feet for shoes. Everything renders at 30fps with smooth bone deformation animations."

**Technical Flow:**
```
Video Frame → MediaPipe (33 keypoints) 
→ Coordinate Mapping (normalize to 3D space)
→ Transform Calculation (position/scale/rotation)
→ Three.js Rendering (WebGL)
→ Canvas Composite (overlay on mirrored video)
```

---

### Q3: **Why is this architecture scalable?**

**Answer:**
> "Our system separates concerns clearly: Frontend handles AR & UI, backend manages data & business logic. We use MongoDB (NoSQL) which scales horizontally. Multiple sellers can operate independently with isolated inventory. Database indexing on frequently-queried fields (userId, category, seller) ensures fast queries. Vite + React lazy loading keeps frontend performant."

**Architecture Benefits:**
- Stateless backend (easy to scale horizontally)
- Database query optimization with indexes
- REST API decoupling
- CDN-ready for 3D models & images

---

### Q4: **How do you handle multi-seller orders?**

**Answer:**
> "Each order can contain items from multiple sellers. We store a 'sellers' array and per-item seller references. When a customer checks out, we group items by seller and create one order with all items. Each seller can independently update status for their items. The customer sees a unified order status aggregated from all sellers."

**Example:**
```javascript
Order {
  items: [
    { seller: "Nike Store", product: "Shoe", status: "shipped" },
    { seller: "Gucci Store", product: "Bag", status: "processing" }
  ],
  overall_status: "processing" // Most critical
}
```

---

### Q5: **What about security?**

**Answer:**
> "We use JWT tokens with 7-day expiration. Passwords are hashed with bcryptjs (salt rounds = 12). Role-based middleware protects routes—admins can access `/admin`, sellers can only access their products, customers have customer-specific access. CORS is configured, and file uploads are validated on server-side."

**Security Measures:**
- JWT + localStorage (not cookies for CORS)
- Bcrypt password hashing
- Role-based authorization middleware
- Input validation on all endpoints
- Secure password change workflow

---

### Q6: **How many users can the system handle?**

**Answer:**
> "Theoretically unlimited, depending on infrastructure:
> - MongoDB Atlas auto-scales
> - Node.js can handle 10k+ concurrent connections
> - Frontend is client-side rendering (no server load)
> - For 100k users/day, we'd deploy on cloud (AWS/GCP)
> - Database indexes ensure O(log n) query times
> - Caching can be added for product catalog"

**Scalability Considerations:**
- Horizontal scaling of Node.js instances
- MongoDB sharding for data partitioning
- Redis caching for hot products
- CDN for static 3D models

---

### Q7: **What are the costs for users?**

**Answer:**
> "ARVANA is completely free for customers. They can browse, try AR, and checkout without premium subscriptions. Sellers pay:
> - Store setup: 0-1000 INR (one-time)
> - Commission: 2-8% per sale (depends on category)
> - This model is common in Flipkart/Amazon."

---

### Q8: **What challenges did you face?**

**Answer:**
> "Main challenges:
> 1. **Coordinate Mapping**: Converting 2D video coordinates to 3D world space with correct scaling
> 2. **Performance**: Pose detection at 30fps without lag requires optimization
> 3. **GLB Model Variety**: Finding or creating realistic 3D models for all products
> 4. **Multi-seller Complexity**: Managing inventory & status from multiple sources
> 5. **AR Accuracy**: Ensuring products appear at correct body positions"

**Solutions:**
- Tested multiple coordinate systems
- Frame skipping in pose detection
- Used Draco compression for GLB files
- Seller approval workflow + database consistency
- Extensive logging & debugging

---

### Q9: **What's the deployment strategy?**

**Answer:**
> "Currently on development setup. For production:
> 1. **Backend**: Deploy to Render/Railway/AWS EC2
> 2. **Frontend**: Ship to Vercel/Netlify (optimized Vite build)
> 3. **Database**: MongoDB Atlas (managed service)
> 4. **CDN**: Cloudflare for static files
> 5. **Monitoring**: Sentry for errors, DataDog for metrics"

---

### Q10: **How do you ensure product accuracy in AR?**

**Answer:**
> "We use real 3D models (GLB format) with proper scale and proportions. Models are rigged with SMPL skeleton for organic deformation. We calibrate based on:
> - Real product dimensions
> - Body measurement standards
> - User feedback & adjustments
> 
> Future: ML model training with real product photos for auto-scaling"

---

### Q11: **What about payment security?**

**Answer:**
> "Currently supports 4 payment methods:
> 1. **Cash on Delivery** (COD) - Test friendly
> 2. **Credit/Debit Cards** - Integration with Stripe/Razorpay (future)
> 3. **UPI** - Integration with NPCI (future)
> 4. **WhatsApp + Manual** - For testing
> 
> For production: Use Razorpay/Stripe for secure card processing with PCI compliance"

---

### Q12: **Can customers customize products?**

**Answer:**
> "Currently, customers can select:
> - Size (via dropdown)
> - Color (via selector)
> - Quantity
> 
> For future:
> - Custom stitching/embroidery
> - Material selection
> - Personalized AR preview"

---

### Q13: **What's your data retention policy?**

**Answer:**
> "Current policy (for demo):
> - User accounts: Keep indefinitely
> - Orders: Keep for 2 years (legal requirement)
> - Reviews: Keep for 1 year (user can delete)
> - Images: Keep while product exists
> 
> Future: Implement GDPR-compliant deletion workflows"

---

### Q14: **How do you handle product returns?**

**Answer:**
> "Currently supports:
> - Order cancellation (before shipped status)
> - Refund requests (customer creates ticket)
> 
> Future implementation:
> - In-app return request form
> - Return label generation
> - Automated refund processing
> - Integration with logistics partners"

---

### Q15: **What's the long-term vision?**

**Answer:**
> "5-Year Roadmap:
> 1. **Current**: Proof of concept with AR try-on basics
> 2. **Year 1**: Expand product catalog, improve AR accuracy
> 3. **Year 2**: Social features (share AR snapshots), live streaming
> 4. **Year 3**: International expansion, mobile app
> 5. **Year 4+**: AI-driven recommendations, virtual showrooms, metaverse integration"

---

## 🚀 Getting Started

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/ARVANA-pvt.git
cd ARVANA-pvt

# Backend setup
cd backend
npm install
cp .env.example .env  # Configure database

# Frontend setup  
cd ../frontend
npm install

# Start development servers
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

### Default Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Customer | customer@test.com | password123 |
| Seller | maihu@gmail.com | password123 |
| Admin | admin@arvana.com | admin123 |

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| **React Components** | 30+ |
| **API Endpoints** | 25+ |
| **Database Collections** | 8 |
| **3D Models** | 50+ GLB files |
| **Lines of Code** | 5000+ |
| **Development Time** | 6+ months |
| **Git Commits** | 100+ |

---

## 🙏 Acknowledgments

- **MediaPipe** - Pose detection ML models
- **Three.js** - 3D graphics library
- **TensorFlow.js** - On-device ML
- **MongoDB** - NoSQL database
- **Express** - Web framework
- **React** - UI library

---

## 📞 Support

For questions or issues:
- 📧 Email: support@arvana.in
- 📱 Phone: +91 95067 20216
- 🏢 Location: Mumbai, India

---

**Made with ❤️ by ARVANA Team**
