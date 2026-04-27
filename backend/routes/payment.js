/**
 * payment.js — Razorpay payment routes
 *
 * POST /api/payment/create-order
 *   → Creates a Razorpay order linked to an existing ARVANA order
 *
 * POST /api/payment/verify
 *   → Verifies Razorpay payment signature and marks order as paid
 */

import { Router }        from 'express'
import { createRequire } from 'module'
import crypto             from 'crypto'
import Order              from '../models/Order.js'
import { protect }        from '../middleware/auth.js'

// razorpay is a CommonJS package — must use createRequire in ESM projects
const require   = createRequire(import.meta.url)
const Razorpay  = require('razorpay')

const router = Router()
router.use(protect)

// Lazy-init Razorpay so it only runs when a payment route is called
// (avoids crash if env isn't loaded yet at module import time)
function getRazorpay() {
  return new Razorpay({
    key_id:     process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
}

// ─────────────────────────────────────────────────────
// POST /api/payment/create-order
// Body: { orderId }  (ARVANA DB order _id)
// Returns: { razorpayOrderId, amount, currency, keyId }
// ─────────────────────────────────────────────────────
router.post('/create-order', async (req, res) => {
  try {
    const { orderId } = req.body
    if (!orderId) {
      return res.status(400).json({ success: false, error: 'orderId is required' })
    }

    const order = await Order.findOne({ _id: orderId, user: req.user._id })
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' })
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, error: 'Order is already paid' })
    }

    // Amount in paise (Razorpay uses smallest currency unit)
    const amountPaise = Math.round(order.total * 100)

    const razorpay = getRazorpay()
    const rzpOrder = await razorpay.orders.create({
      amount:   amountPaise,
      currency: 'INR',
      receipt:  order.orderNumber,
      notes: {
        orderId:     order._id.toString(),
        orderNumber: order.orderNumber,
        userId:      req.user._id.toString(),
      },
    })

    // Save razorpay order ID on our order
    order.razorpayOrderId = rzpOrder.id
    await order.save()

    res.json({
      success: true,
      data: {
        razorpayOrderId: rzpOrder.id,
        amount:          amountPaise,
        currency:        'INR',
        keyId:           process.env.RAZORPAY_KEY_ID,
        orderNumber:     order.orderNumber,
        prefill: {
          name:  req.user.name  || '',
          email: req.user.email || '',
          contact: order.shippingAddress?.phone || '',
        },
      },
    })
  } catch (err) {
    console.error('[Payment] create-order error:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

// ─────────────────────────────────────────────────────
// POST /api/payment/verify
// Body: { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId }
// ─────────────────────────────────────────────────────
router.post('/verify', async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderId) {
      return res.status(400).json({ success: false, error: 'Missing payment verification fields' })
    }

    // Verify HMAC SHA256 signature
    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex')

    if (expectedSig !== razorpaySignature) {
      return res.status(400).json({ success: false, error: 'Payment verification failed — invalid signature' })
    }

    // Mark order as paid
    const order = await Order.findOneAndUpdate(
      { _id: orderId, user: req.user._id },
      {
        paymentStatus:      'paid',
        razorpayPaymentId,
        razorpaySignature,
        status:             'confirmed',
      },
      { new: true }
    )

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' })
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: order,
    })
  } catch (err) {
    console.error('[Payment] verify error:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
