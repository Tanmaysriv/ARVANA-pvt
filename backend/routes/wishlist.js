import { Router } from 'express'
import Wishlist from '../models/Wishlist.js'
import Product from '../models/Product.js'

const router = Router()

// GET /api/wishlist?userId=xxx
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId || 'guest'
    let wishlist = await Wishlist.findOne({ userId }).lean()

    if (!wishlist) {
      wishlist = { items: [] }
    }

    res.json({
      success: true,
      data: {
        items: wishlist.items,
        count: wishlist.items.length
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// POST /api/wishlist — add item
router.post('/', async (req, res) => {
  try {
    const { productId, userId = 'guest' } = req.body

    const product = await Product.findOne({ productId }).lean()
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' })
    }

    let wishlist = await Wishlist.findOne({ userId })
    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [] })
    }

    const exists = wishlist.items.find(item => item.productId === productId)
    if (exists) {
      return res.status(409).json({ success: false, error: 'Item already in wishlist' })
    }

    wishlist.items.push({
      productId: product.productId,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      addedAt: new Date()
    })

    await wishlist.save()

    res.status(201).json({
      success: true,
      message: `${product.name} added to wishlist`,
      data: wishlist
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE /api/wishlist/:productId
router.delete('/:productId', async (req, res) => {
  try {
    const userId = req.query.userId || 'guest'
    const wishlist = await Wishlist.findOne({ userId })

    if (!wishlist) {
      return res.status(404).json({ success: false, error: 'Wishlist not found' })
    }

    const before = wishlist.items.length
    wishlist.items = wishlist.items.filter(i => i.productId !== parseInt(req.params.productId))

    if (wishlist.items.length === before) {
      return res.status(404).json({ success: false, error: 'Item not in wishlist' })
    }

    await wishlist.save()

    res.json({ success: true, message: 'Removed from wishlist', data: wishlist })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
