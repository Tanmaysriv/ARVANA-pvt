import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import Product from '../models/Product.js'
import Order from '../models/Order.js'
import Category from '../models/Category.js'
import { protect, approvedSeller } from '../middleware/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = Router()

// All seller routes require authentication + approved seller status
router.use(protect, approvedSeller)

// ──────────────────────────────────────────────
// IMAGE UPLOAD
// ──────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `seller-${req.user._id}-${Date.now()}${ext}`)
  },
})
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'model/gltf-binary', 'model/gltf+json', 'application/octet-stream']
  const ext = path.extname(file.originalname).toLowerCase()
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.glb', '.gltf']
  
  if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error('Only images and 3D models (.glb, .gltf) are allowed'), false)
  }
}
const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } })

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' })
  res.json({ success: true, data: { url: `/uploads/${req.file.filename}` } })
})

// ──────────────────────────────────────────────
// DASHBOARD STATS (seller-specific)
// ──────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const sellerId = req.user._id

    const [totalProducts, orders] = await Promise.all([
      Product.countDocuments({ seller: sellerId }),
      Order.find({ sellers: sellerId }).select('total status items createdAt').lean(),
    ])

    // Calculate revenue only from this seller's items
    let totalRevenue = 0
    let totalItemsSold = 0
    const statusCounts = {}

    for (const order of orders) {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1
      for (const item of order.items) {
        if (item.seller && item.seller.toString() === sellerId.toString()) {
          totalRevenue += item.price * item.quantity
          totalItemsSold += item.quantity
        }
      }
    }

    // Revenue last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    let recentRevenue = 0
    for (const order of orders) {
      if (new Date(order.createdAt) >= thirtyDaysAgo) {
        for (const item of order.items) {
          if (item.seller && item.seller.toString() === sellerId.toString()) {
            recentRevenue += item.price * item.quantity
          }
        }
      }
    }

    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders: orders.length,
        totalRevenue: Math.round(totalRevenue),
        recentRevenue: Math.round(recentRevenue),
        totalItemsSold,
        statusCounts,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// ──────────────────────────────────────────────
// PRODUCTS (seller can only manage their own)
// ──────────────────────────────────────────────

// GET /api/seller/products — list own products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id })
      .sort({ createdAt: -1 }).lean()
    res.json({ success: true, count: products.length, data: products })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// POST /api/seller/products — create a product
router.post('/products', async (req, res) => {
  try {
    const lastProduct = await Product.findOne().sort({ productId: -1 }).lean()
    const nextId = lastProduct ? lastProduct.productId + 1 : 1

    const product = await Product.create({
      ...req.body,
      category: req.body.category?.toLowerCase() || '',
      productId: nextId,
      seller: req.user._id,
    })
    res.status(201).json({ success: true, data: product })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message)
      return res.status(400).json({ success: false, error: messages.join(', ') })
    }
    res.status(500).json({ success: false, error: error.message })
  }
})

// PUT /api/seller/products/:id — update own product only
router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, seller: req.user._id })
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found or not yours' })
    }

    // Prevent changing seller
    delete req.body.seller
    Object.assign(product, req.body)
    await product.save()

    res.json({ success: true, data: product })
  } catch (error) {
    console.error('PUT /products/:id error:', error)
    res.status(500).json({ success: false, error: error.message, stack: error.stack })
  }
})

// DELETE /api/seller/products/:id — delete own product only
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user._id })
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found or not yours' })
    }
    res.json({ success: true, message: 'Product deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// ──────────────────────────────────────────────
// ORDERS (only orders containing seller's products)
// ──────────────────────────────────────────────

// GET /api/seller/orders — orders with this seller's products
router.get('/orders', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const filter = { sellers: req.user._id }
    if (status && status !== 'all') filter.status = status

    const skip = (Number(page) - 1) * Number(limit)
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Order.countDocuments(filter),
    ])

    // Filter items to only show this seller's items
    const sellerId = req.user._id.toString()
    const filtered = orders.map(order => ({
      ...order,
      items: order.items.filter(item =>
        item.seller && item.seller.toString() === sellerId
      ),
    }))

    res.json({
      success: true,
      data: filtered,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET /api/seller/orders/:id — single order (must contain seller's product)
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, sellers: req.user._id })
      .populate('user', 'name email phone').lean()

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' })
    }

    // Filter items
    const sellerId = req.user._id.toString()
    order.items = order.items.filter(item =>
      item.seller && item.seller.toString() === sellerId
    )

    res.json({ success: true, data: order })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// PATCH /api/seller/orders/:id/status — update order status (limited)
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    // Sellers can set: confirmed, processing, shipped, delivered
    const sellerStatuses = ['confirmed', 'processing', 'shipped', 'delivered']
    if (!sellerStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Sellers can only set status to: ${sellerStatuses.join(', ')}`,
      })
    }

    const order = await Order.findOne({ _id: req.params.id, sellers: req.user._id })
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' })
    }

    order.status = status
    await order.save()

    res.json({ success: true, data: order })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET /api/seller/categories — get categories (read-only for sellers)
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().lean()
    res.json({ success: true, data: categories })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
