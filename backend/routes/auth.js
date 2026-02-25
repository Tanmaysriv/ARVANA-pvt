import { Router } from 'express'
import User from '../models/User.js'
import { generateToken, protect } from '../middleware/auth.js'

const router = Router()

// ─── POST /api/auth/register ───
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email and password are required' })
    }

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists' })
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone || '',
    })

    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      data: {
        user: user.toJSON(),
        token,
      },
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message)
      return res.status(400).json({ success: false, error: messages.join(', ') })
    }
    res.status(500).json({ success: false, error: error.message })
  }
})

// ─── POST /api/auth/login ───
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' })
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' })
    }

    const token = generateToken(user._id)

    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        token,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// ─── GET /api/auth/me — get current user profile ───
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  })
})

// ─── PUT /api/auth/me — update profile ───
router.put('/me', protect, async (req, res) => {
  try {
    const { name, phone, avatar, address } = req.body
    const updates = {}
    if (name) updates.name = name.trim()
    if (phone !== undefined) updates.phone = phone.trim()
    if (avatar !== undefined) updates.avatar = avatar
    if (address && typeof address === 'object') {
      updates.address = {
        street: (address.street || '').trim(),
        city: (address.city || '').trim(),
        state: (address.state || '').trim(),
        pincode: (address.pincode || '').trim(),
        country: (address.country || 'India').trim(),
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    })

    res.json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// ─── PUT /api/auth/password — change password ───
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Current and new passwords are required' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'New password must be at least 6 characters' })
    }

    const user = await User.findById(req.user._id).select('+password')
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' })
    }

    user.password = newPassword
    await user.save()

    const token = generateToken(user._id)
    res.json({ success: true, data: { token }, message: 'Password updated successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
