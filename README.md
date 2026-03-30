# 🛍️ ARVANA - AR Virtual Try-On E-Commerce Platform

<p align="center">
  <img src="frontend/public/logo.png" alt="ARVANA Logo" width="200"/>
</p>

<p align="center">
  <strong>Experience products before you buy with Augmented Reality</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-22+-339933?logo=node.js" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-9.2-47A248?logo=mongodb" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Three.js-0.159-000000?logo=three.js" alt="Three.js"/>
  <img src="https://img.shields.io/badge/TensorFlow.js-4.2-FF6F00?logo=tensorflow" alt="TensorFlow"/>
</p>

---

## 🌟 Overview

**ARVANA** is a full-stack AR-powered e-commerce platform that lets customers virtually try on products using their camera before purchasing. The platform supports multiple product categories including shoes, bags, clothes, watches, and jewelry with real-time body tracking and 3D visualization.

### ✨ Key Highlights

- 🎯 **Real-time AR Try-On** - Try shoes, watches, clothes on your body using webcam
- 🏪 **Multi-Seller Marketplace** - Sellers can register, list products, and manage orders
- 💳 **Indian Payment Integration** - UPI, WhatsApp payments with QR code support
- 🤖 **AI-Powered Body Tracking** - MediaPipe + TensorFlow.js for accurate pose detection
- 🎨 **Dynamic 3D Models** - Procedural model generation without pre-made assets

---

## 🚀 Quick Start

### Prerequisites

- Node.js v22+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ARVANA-pvt.git
cd ARVANA-pvt

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Configuration

Create `.env` file in the `backend` folder:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/arvana
JWT_SECRET=your-secret-key
```

### Running the Application

```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend
cd frontend
npm run dev
```

Visit **http://localhost:5173** to access the application.

---

## 📁 Project Structure

```
ARVANA-pvt/
├── backend/                 # Node.js + Express + MongoDB
│   ├── models/             # Mongoose schemas (User, Product, Order, etc.)
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth, authorization middleware
│   ├── db/                 # Database connection & seeding
│   └── uploads/            # Product images
│
├── frontend/               # React + Vite + Three.js
│   ├── src/
│   │   ├── components/     # UI components & pages
│   │   ├── ar/             # AR Engine, trackers, renderers
│   │   ├── services/       # API client, model generation
│   │   ├── context/        # Auth, Cart, Theme contexts
│   │   └── hooks/          # Custom React hooks
│   └── public/             # Static assets
│
└── package.json            # Monorepo scripts
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18.2 | UI Framework |
| Vite 5.0 | Build Tool |
| Three.js | 3D Rendering |
| TensorFlow.js | ML/AI |
| MediaPipe | Pose Detection |
| Tailwind CSS | Styling |
| Framer Motion | Animations |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express 4.18 | Web Framework |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| Multer | File Uploads |
| bcryptjs | Password Hashing |

---

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **Customer** | Browse, try AR, cart, wishlist, orders, reviews |
| **Seller** | Product management, order fulfillment, dashboard |
| **Admin** | Full platform control, seller approval, analytics |

---

## 💳 Payment Methods

- 💵 **Cash on Delivery (COD)**
- 💳 **Credit/Debit Cards**
- 📱 **UPI Payments**
- 💬 **WhatsApp + Manual Payment**

---

## 📖 Documentation

For detailed documentation, see:

- **[PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)** - Complete technical documentation with workflow diagrams

---

## 🎯 Demo Accounts

```
Customer: customer@test.com / password123
Seller:   maihu@gmail.com / password123
Admin:    admin@arvana.com / admin123
```

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- MediaPipe by Google
- Three.js Community
- TensorFlow.js Team

---

<p align="center">
  Made with ❤️ by ARVANA Team
</p>
