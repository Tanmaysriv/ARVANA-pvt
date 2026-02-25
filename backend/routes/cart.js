import { Router } from 'express'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'

const router = Router()

// GET /api/cart?userId=xxx — get cart items
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId || 'guest'
    let cart = await Cart.findOne({ userId }).lean()

    if (!cart) {
      cart = { items: [], updatedAt: new Date() }
    }

    const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0)

    res.json({
      success: true,
      data: {
        items: cart.items,
        total: Math.round(total * 100) / 100,
        count,
        updatedAt: cart.updatedAt
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// POST /api/cart — add item to cart
router.post('/', async (req, res) => {
  try {
    const { productId, quantity = 1, userId = 'guest' } = req.body

    const product = await Product.findOne({ productId }).lean()
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' })
    }

    let cart = await Cart.findOne({ userId })
    if (!cart) {
      cart = new Cart({ userId, items: [] })
    }

    const existingItem = cart.items.find(item => item.productId === productId)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.items.push({
        productId: product.productId,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        quantity
      })
    }

    cart.updatedAt = new Date()
    await cart.save()

    res.status(201).json({
      success: true,
      message: `${product.name} added to cart`,
      data: cart
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// PUT /api/cart/:itemId — update item quantity
router.put('/:itemId', async (req, res) => {
  try {
    const { userId = 'guest', quantity } = req.body
    const cart = await Cart.findOne({ userId })

    if (!cart) {
      return res.status(404).json({ success: false, error: 'Cart not found' })
    }

    const item = cart.items.find(
      i => i._id.toString() === req.params.itemId || i.productId === parseInt(req.params.itemId)
    )

    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not in cart' })
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i._id.toString() !== item._id.toString())
    } else {
      item.quantity = quantity
    }

    cart.updatedAt = new Date()
    await cart.save()

    res.json({ success: true, data: cart })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE /api/cart/:itemId — remove item from cart
router.delete('/:itemId', async (req, res) => {
  try {
    const userId = req.query.userId || 'guest'
    const cart = await Cart.findOne({ userId })

    if (!cart) {
      return res.status(404).json({ success: false, error: 'Cart not found' })
    }

    const before = cart.items.length
    cart.items = cart.items.filter(
      i => i._id.toString() !== req.params.itemId && i.productId !== parseInt(req.params.itemId)
    )

    if (cart.items.length === before) {
      return res.status(404).json({ success: false, error: 'Item not in cart' })
    }

    cart.updatedAt = new Date()
    await cart.save()

    res.json({ success: true, message: 'Item removed from cart', data: cart })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE /api/cart — clear entire cart
router.delete('/', async (req, res) => {
  try {
    const userId = req.query.userId || 'guest'
    await Cart.findOneAndUpdate(
      { userId },
      { items: [], updatedAt: new Date() },
      { upsert: true }
    )

    res.json({ success: true, message: 'Cart cleared' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
