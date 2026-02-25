import { Router } from 'express'
import Product from '../models/Product.js'

const router = Router()

// GET /api/products — get all products (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { category, sort, search, minPrice, maxPrice } = req.query
    let query = {}

    // Filter by category
    if (category && category !== 'all') {
      query.category = category
    }

    // Search by name, brand, description, or category
    if (search) {
      const q = search.trim()
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = parseFloat(minPrice)
      if (maxPrice) query.price.$lte = parseFloat(maxPrice)
    }

    // Build sort object
    let sortOption = {}
    if (sort === 'price-low') {
      sortOption = { price: 1 }
    } else if (sort === 'price-high') {
      sortOption = { price: -1 }
    } else if (sort === 'rating') {
      sortOption = { rating: -1 }
    } else if (sort === 'discount') {
      // Discount sort requires JS computation — fetch then sort
    }

    let result
    if (sort === 'discount') {
      result = await Product.find(query).lean()
      result.sort((a, b) => {
        const discA = ((a.originalPrice - a.price) / a.originalPrice) * 100
        const discB = ((b.originalPrice - b.price) / b.originalPrice) * 100
        return discB - discA
      })
    } else {
      result = await Product.find(query).sort(sortOption).lean()
    }

    res.json({
      success: true,
      count: result.length,
      data: result
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET /api/products/:id — get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ productId: parseInt(req.params.id) }).lean()
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' })
    }
    res.json({ success: true, data: product })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
