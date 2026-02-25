# ARVANA Backend API

REST API server for the ARVANA AR Virtual Try-On e-commerce platform.

## Tech Stack

- **Runtime:** Node.js (v22+)
- **Framework:** Express 4.18
- **Storage:** In-memory (Maps & Arrays)
- **Modules:** ES Modules (`"type": "module"`)

## Getting Started

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create a `.env` file (or use the existing one):

```env
PORT=5000
NODE_ENV=development
```

### 3. Start the Server

```bash
# Production
npm start

# Development (auto-restart on file changes)
npm run dev
```

The server will start at **http://localhost:5000**

---

## Project Structure

```
backend/
├── .env                 # Environment variables
├── package.json         # Dependencies & scripts
├── server.js            # Express app entry point
├── data/
│   ├── products.js      # Seed data: 12 products + 5 categories
│   └── reviews.js       # Seed data: 5 reviews
└── routes/
    ├── products.js      # Product listing & details
    ├── categories.js    # Category listing
    ├── cart.js           # Cart CRUD operations
    ├── wishlist.js       # Wishlist CRUD operations
    ├── orders.js         # Order placement & history
    ├── newsletter.js     # Email subscription
    └── reviews.js        # Product reviews
```

---

## API Reference

Base URL: `http://localhost:5000/api`

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server status & timestamp |

---

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get a single product |

**Query Parameters** for `GET /api/products`:

| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category (`shoes`, `bags`, `clothes`, `watches`) |
| `search` | string | Search by name, brand, or description |
| `sort` | string | Sort order: `price-low`, `price-high`, `rating`, `discount` |
| `minPrice` | number | Minimum price filter |
| `maxPrice` | number | Maximum price filter |

**Example:**
```
GET /api/products?category=shoes&sort=price-low&minPrice=50&maxPrice=200
```

---

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories |

---

### Cart

All cart endpoints use `userId` to identify the user (defaults to `"guest"`).

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart?userId=xxx` | Get cart contents |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/:itemId` | Update item quantity |
| DELETE | `/api/cart/:itemId` | Remove item from cart |
| DELETE | `/api/cart?userId=xxx` | Clear entire cart |

**POST Body:**
```json
{
  "productId": 1,
  "quantity": 2,
  "userId": "guest"
}
```

---

### Wishlist

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wishlist?userId=xxx` | Get wishlist |
| POST | `/api/wishlist` | Add item to wishlist |
| DELETE | `/api/wishlist/:productId` | Remove from wishlist |

**POST Body:**
```json
{
  "productId": 1,
  "userId": "guest"
}
```

---

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place a new order |
| GET | `/api/orders?userId=xxx` | Get order history |
| GET | `/api/orders/:id` | Get single order by ID or order number |

**POST Body:**
```json
{
  "userId": "guest",
  "items": [
    { "productId": 1, "name": "Nike Air Max 270", "price": 129.99, "quantity": 1 }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "zip": "10001"
  },
  "paymentMethod": "card"
}
```

> Free shipping on orders ≥ $50. Otherwise, $5.99 shipping fee.

---

### Newsletter

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/newsletter` | Subscribe to newsletter |
| GET | `/api/newsletter/subscribers` | List all subscribers (admin) |

**POST Body:**
```json
{
  "email": "user@example.com"
}
```

---

### Reviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews` | List all reviews |
| GET | `/api/reviews?productId=1` | Reviews for a specific product |
| POST | `/api/reviews` | Submit a new review |

**POST Body:**
```json
{
  "productId": 1,
  "userName": "John D.",
  "rating": 5,
  "comment": "Great product!"
}
```

---

## Data Models

### Product
```
id            number       Unique identifier
name          string       Product name
brand         string       Brand name
category      string       "shoes" | "bags" | "clothes" | "watches"
price         number       Current price
originalPrice number       Price before discount
rating        number       Average rating (1-5)
reviewCount   number       Total number of reviews
image         string       Image URL
description   string       Product description
colors        string[]     Available colors
sizes         string[]     Available sizes
badge         string|null  "Bestseller", "New", "Sale", "Trending", or null
inStock       boolean      Availability status
```

### Cart Item
```
id            uuid         Cart item ID
productId     number       Reference to product
name          string       Product name
brand         string       Brand name
price         number       Unit price
originalPrice number       Original price
image         string       Image URL
category      string       Product category
quantity      number       Item quantity
```

### Order
```
id                uuid       Order ID
orderNumber       string     "ARV-XXXXXXXX"
userId            string     User identifier
items             array      Ordered items
subtotal          number     Items total
shipping          number     Shipping cost (0 if subtotal ≥ 50)
total             number     Final total
shippingAddress   object     Delivery address
paymentMethod     string     Payment method
status            string     "confirmed"
createdAt         ISO date   Order timestamp
estimatedDelivery ISO date   Expected delivery (+3 days)
```

### Review
```
id            number       Unique identifier
productId     number       Reference to product
userName      string       Reviewer name
rating        number       Rating (1-5)
comment       string       Review text
verified      boolean      Verified purchase flag
date          string       "YYYY-MM-DD"
avatar        string       Avatar image URL
```

---

## Seed Data

The server comes pre-loaded with:

- **12 Products** — 3 shoes, 3 bags, 3 clothes, 3 watches
- **5 Categories** — Footwear, Bags, Watches, Jewellery, Clothes
- **5 Reviews** — Sample verified reviews

---

## Important Notes

- **In-memory storage** — All data (cart, wishlist, orders, subscribers) resets when the server restarts.
- **No authentication** — `userId` is passed as a parameter; there is no token-based auth.
- **No database** — Ready to be upgraded to MongoDB, PostgreSQL, etc.
- **CORS enabled** — Accepts requests from any origin.
- **Frontend proxy** — The Vite dev server proxies `/api` requests to this backend on port 5000.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the server |
| `npm run dev` | Start with auto-reload (`--watch`) |

---

## License

MIT
