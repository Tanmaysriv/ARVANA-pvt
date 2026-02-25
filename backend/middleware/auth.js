import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'arvana-jwt-secret-key-2026'

/**
 * Generate a JWT token for a user
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' })
}

/**
 * Middleware: Protect routes — requires valid JWT
 */
export const protect = async (req, res, next) => {
  try {
    let token
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ success: false, error: 'Not authorised — no token' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({ success: false, error: 'User no longer exists' })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, error: 'Invalid token' })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Token expired — please log in again' })
    }
    return res.status(500).json({ success: false, error: error.message })
  }
}

/**
 * Middleware: Admin-only routes
 */
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next()
  }
  return res.status(403).json({ success: false, error: 'Admin access required' })
}
