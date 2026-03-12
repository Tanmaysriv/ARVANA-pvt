import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import Category from '../models/Category.js'
import User from '../models/User.js'
import { protect, adminOnly } from '../middleware/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = Router()

// All admin routes require authentication + admin role
router.use(protect, adminOnly)

// ──────────────────────────────────────────────
// IMAGE UPLOAD (multer)
// ──────────────────────────────────────────────

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, `product-${uniqueSuffix}${ext}`)
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only image files (JPEG, PNG, WebP, GIF) are allowed'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
})

// POST /api/admin/upload — upload a single image
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No image file provided' })
  }

  const imageUrl = `/uploads/${req.file.filename}`
  res.json({
    success: true,
    data: { url: imageUrl, filename: req.file.filename, size: req.file.size },
  })
})

// ──────────────────────────────────────────────
// DASHBOARD STATS
// ──────────────────────────────────────────────

router.get('/stats', async (req, res) => {
  try {
    const [totalOrders, totalProducts, totalUsers, totalCategories, totalSellers, orders] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Category.countDocuments(),
      User.countDocuments({ role: 'seller' }),
      Order.find().select('total status createdAt').lean(),
    ])

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)

    // Orders by status
    const statusCounts = {}
    for (const o of orders) {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1
    }

    // Revenue last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentRevenue = orders
      .filter(o => new Date(o.createdAt) >= thirtyDaysAgo)
      .reduce((sum, o) => sum + (o.total || 0), 0)

    res.json({
      success: true,
      data: {
        totalOrders,
        totalProducts,
        totalUsers,
        totalCategories,
        totalSellers,
        totalRevenue: Math.round(totalRevenue),
        recentRevenue: Math.round(recentRevenue),
        statusCounts,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// ──────────────────────────────────────────────
// ORDERS (admin can see ALL orders)
// ──────────────────────────────────────────────

// GET /api/admin/orders — list all orders
router.get('/orders', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const filter = {}
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

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET /api/admin/orders/:id — single order detail
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .lean()

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' })
    }

    res.json({ success: true, data: order })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// PATCH /api/admin/orders/:id/status — update order status
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: `Status must be one of: ${validStatuses.join(', ')}` })
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'name email phone')

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' })
    }

    res.json({ success: true, data: order })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// ──────────────────────────────────────────────
// PRODUCTS CRUD
// ──────────────────────────────────────────────

// POST /api/admin/products — create a product
router.post('/products', async (req, res) => {
  try {
    // Auto-assign productId
    const lastProduct = await Product.findOne().sort({ productId: -1 }).lean()
    const nextId = lastProduct ? lastProduct.productId + 1 : 1

    const product = await Product.create({ ...req.body, productId: nextId })
    res.status(201).json({ success: true, data: product })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message)
      return res.status(400).json({ success: false, error: messages.join(', ') })
    }
    res.status(500).json({ success: false, error: error.message })
  }
})

// PUT /api/admin/products/:id — update a product
router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' })
    }

    res.json({ success: true, data: product })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message)
      return res.status(400).json({ success: false, error: messages.join(', ') })
    }
    res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE /api/admin/products/:id
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' })
    }
    res.json({ success: true, message: 'Product deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// ──────────────────────────────────────────────
// CATEGORIES CRUD
// ──────────────────────────────────────────────

// POST /api/admin/categories
router.post('/categories', async (req, res) => {
  try {
    const category = await Category.create(req.body)
    res.status(201).json({ success: true, data: category })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Category ID already exists' })
    }
    res.status(500).json({ success: false, error: error.message })
  }
})

// PUT /api/admin/categories/:id
router.put('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' })
    }
    res.json({ success: true, data: category })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE /api/admin/categories/:id
router.delete('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' })
    }
    res.json({ success: true, message: 'Category deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// ──────────────────────────────────────────────
// USERS
// ──────────────────────────────────────────────

router.get('/users', async (req, res) => {
  try {
    const { role } = req.query
    const filter = {}
    if (role) filter.role = role
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 }).lean()
    res.json({ success: true, count: users.length, data: users })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// ──────────────────────────────────────────────
// SELLER MANAGEMENT
// ──────────────────────────────────────────────

// GET /api/admin/sellers — list all sellers
router.get('/sellers', async (req, res) => {
  try {
    const { status } = req.query
    const filter = { role: 'seller' }
    if (status) filter.sellerStatus = status

    const sellers = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .lean()

    // Attach product count + revenue for each seller
    const enriched = await Promise.all(sellers.map(async (seller) => {
      const productCount = await Product.countDocuments({ seller: seller._id })
      const orders = await Order.find({ sellers: seller._id }).select('items').lean()
      let revenue = 0
      for (const order of orders) {
        for (const item of order.items) {
          if (item.seller && item.seller.toString() === seller._id.toString()) {
            revenue += item.price * item.quantity
          }
        }
      }
      return { ...seller, productCount, revenue: Math.round(revenue) }
    }))

    res.json({ success: true, count: enriched.length, data: enriched })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// PATCH /api/admin/sellers/:id/status — approve or block a seller
router.patch('/sellers/:id/status', async (req, res) => {
  try {
    const { sellerStatus } = req.body
    if (!['approved', 'blocked', 'pending'].includes(sellerStatus)) {
      return res.status(400).json({ success: false, error: 'Invalid status' })
    }

    const seller = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'seller' },
      { sellerStatus },
      { new: true }
    ).select('-password')

    if (!seller) {
      return res.status(404).json({ success: false, error: 'Seller not found' })
    }

    res.json({ success: true, data: seller })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
