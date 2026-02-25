import { Router } from 'express'
import Review from '../models/Review.js'

const router = Router()

// GET /api/reviews — get all reviews (with optional productId filter)
router.get('/', async (req, res) => {
  try {
    const { productId } = req.query
    let query = {}

    if (productId) {
      query.productId = parseInt(productId)
    }

    const reviews = await Review.find(query).sort({ createdAt: -1 }).lean()

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// POST /api/reviews — add a review
router.post('/', async (req, res) => {
  try {
    const { productId, userName, rating, comment } = req.body

    if (!productId || !userName || !rating) {
      return res.status(400).json({ success: false, error: 'productId, userName, and rating are required' })
    }

    const newReview = await Review.create({
      productId,
      userName,
      rating: Math.min(5, Math.max(1, rating)),
      comment: comment || '',
      verified: false,
      date: new Date().toISOString().split('T')[0],
      avatar: `https://i.pravatar.cc/150?u=${userName}`
    })

    res.status(201).json({
      success: true,
      message: 'Review submitted!',
      data: newReview
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
