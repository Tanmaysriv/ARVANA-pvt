import { Router } from 'express'
import Category from '../models/Category.js'

const router = Router()

// GET /api/categories — get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().lean()
    res.json({ success: true, data: categories })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
