import { Router } from 'express'
import Subscriber from '../models/Subscriber.js'

const router = Router()

// POST /api/newsletter — subscribe to newsletter
router.post('/', async (req, res) => {
  try {
    const { email } = req.body

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email is required' })
    }

    const exists = await Subscriber.findOne({ email: email.toLowerCase() })
    if (exists) {
      return res.status(409).json({ success: false, error: 'Already subscribed' })
    }

    await Subscriber.create({ email })

    res.status(201).json({
      success: true,
      message: 'Subscribed successfully! Check your inbox for your 10% discount code.'
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET /api/newsletter/subscribers (admin)
router.get('/subscribers', async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 }).lean()

    res.json({
      success: true,
      count: subscribers.length,
      data: subscribers
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
