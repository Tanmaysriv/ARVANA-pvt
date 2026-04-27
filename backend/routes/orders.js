import { Router } from 'express'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { protect } from '../middleware/auth.js'

const router = Router()

// All order routes require authentication
router.use(protect)

// POST /api/orders — place a new order
router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'No items in order' })
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode || !shippingAddress.phone) {
      return res.status(400).json({ success: false, error: 'Complete shipping address is required' })
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal >= 999 ? 0 : 99
    const total = Math.round(subtotal + shipping)

    // ── Stock validation (before creating the order) ──
    for (const item of items) {
      const pid = parseInt(item.productId)
      if (!pid) continue
      const product = await Product.findOne({ productId: pid }).select('name stock inStock').lean()
      if (!product) continue
      if (!product.inStock || product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `"${item.name}" is out of stock or has insufficient quantity (available: ${product.stock ?? 0})`,
        })
      }
    }

    // Look up sellers for each item from the Product collection
    const productIds = items.map(i => parseInt(i.productId)).filter(Boolean)
    const products = await Product.find({ productId: { $in: productIds } }).select('productId seller').lean()
    const sellerMap = {}
    for (const p of products) {
      if (p.seller) sellerMap[p.productId] = p.seller
    }

    // Attach seller to each item + collect unique sellers
    const sellerSet = new Set()
    const enrichedItems = items.map(item => {
      const sid = sellerMap[parseInt(item.productId)] || null
      if (sid) sellerSet.add(sid.toString())
      return { ...item, seller: sid }
    })

    const order = await Order.create({
      orderNumber: `ARV-${Date.now().toString().slice(-8)}`,
      user: req.user._id,
      sellers: [...sellerSet],
      items: enrichedItems,
      subtotal: Math.round(subtotal),
      shipping,
      total,
      shippingAddress,
      paymentMethod: paymentMethod || 'cod',
      status: 'pending',
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    })

    // ── Atomic stock deduction (after order created) ──
    await Promise.all(
      items.map(item => {
        const pid = parseInt(item.productId)
        if (!pid) return Promise.resolve()
        return Product.findOneAndUpdate(
          { productId: pid },
          { $inc: { stock: -item.quantity } },
          { new: true }
        ).then(updated => {
          // Sync inStock flag
          if (updated) {
            return Product.findByIdAndUpdate(updated._id, { inStock: updated.stock > 0 })
          }
        })
      })
    )

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: order,
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message)
      return res.status(400).json({ success: false, error: messages.join(', ') })
    }
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET /api/orders — get all orders for the logged-in user
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).lean()

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET /api/orders/:id — get a single order (must belong to user)
router.get('/:id', async (req, res) => {
  try {
    const param = req.params.id
    let order

    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findOne({ _id: param, user: req.user._id }).lean()
    }

    if (!order) {
      order = await Order.findOne({ orderNumber: param, user: req.user._id }).lean()
    }

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' })
    }

    res.json({ success: true, data: order })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// PATCH /api/orders/:id/cancel — cancel an order (only if pending or confirmed)
router.patch('/:id/cancel', async (req, res) => {
  try {
    const param = req.params.id
    let order

    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findOne({ _id: param, user: req.user._id })
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: param, user: req.user._id })
    }
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' })
    }

    const cancellable = ['pending', 'confirmed']
    if (!cancellable.includes(order.status)) {
      return res.status(400).json({
        success: false,
        error: `Cannot cancel order — it is already ${order.status}`,
      })
    }

    order.status = 'cancelled'
    order.cancelledAt = new Date()
    await order.save()

    // ── Restore stock for each cancelled item ──
    await Promise.all(
      order.items.map(item => {
        const pid = parseInt(item.productId)
        if (!pid) return Promise.resolve()
        return Product.findOneAndUpdate(
          { productId: pid },
          { $inc: { stock: item.quantity } },
          { new: true }
        ).then(updated => {
          if (updated) {
            return Product.findByIdAndUpdate(updated._id, { inStock: updated.stock > 0 })
          }
        })
      })
    )

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
