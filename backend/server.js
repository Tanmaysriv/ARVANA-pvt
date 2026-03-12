import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './db/connect.js'
import productRoutes from './routes/products.js'
import cartRoutes from './routes/cart.js'
import wishlistRoutes from './routes/wishlist.js'
import orderRoutes from './routes/orders.js'
import newsletterRoutes from './routes/newsletter.js'
import categoryRoutes from './routes/categories.js'
import reviewRoutes from './routes/reviews.js'
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import sellerRoutes from './routes/seller.js'
import User from './models/User.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Request logger (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
  })
}

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/newsletter', newsletterRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/seller', sellerRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Connect to MongoDB, then start the server
const start = async () => {
  try {
    await connectDB()

    // One-time migration: convert legacy role 'user' → 'customer'
    const migrated = await User.updateMany({ role: 'user' }, { $set: { role: 'customer' } })
    if (migrated.modifiedCount > 0) {
      console.log(`🔄 Migrated ${migrated.modifiedCount} user(s) from role "user" to "customer"`)
    }

    app.listen(PORT, () => {
      console.log(`\n🚀 ARVANA Backend running on http://localhost:${PORT}`)
      console.log(`📦 API available at http://localhost:${PORT}/api\n`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error.message)
    process.exit(1)
  }
}

start()
