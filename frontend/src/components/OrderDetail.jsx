import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Package, MapPin, CreditCard, Truck, CheckCircle2, Clock, XCircle, Box, AlertTriangle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const statusConfig = {
  pending:    { color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800', icon: Clock, label: 'Pending' },
  confirmed:  { color: 'text-sky-600 bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800', icon: CheckCircle2, label: 'Confirmed' },
  processing: { color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800', icon: Box, label: 'Processing' },
  shipped:    { color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800', icon: Truck, label: 'Shipped' },
  delivered:  { color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800', icon: CheckCircle2, label: 'Delivered' },
  cancelled:  { color: 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800', icon: XCircle, label: 'Cancelled' },
}

const statusSteps = ['confirmed', 'processing', 'shipped', 'delivered']

const OrderDetail = () => {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.getOrder(id)
        if (res.success) {
          setOrder(res.data)
        } else {
          setError(res.error || 'Order not found')
        }
      } catch (err) {
        setError(err.message || 'Failed to load order')
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) fetchOrder()
    else setLoading(false)
  }, [id, isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 px-4">
        <div className="max-w-md mx-auto text-center py-20">
          <Package className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Login Required</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Sign in to view order details.</p>
          <Link to="/login" state={{ from: `/orders/${id}` }} className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 px-4 pb-20">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-24 animate-pulse" />
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 animate-pulse space-y-4">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-48" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32" />
            <div className="flex gap-3 mt-4">{[1, 2].map(i => <div key={i} className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-lg" />)}</div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 px-4">
        <div className="max-w-md mx-auto text-center py-20">
          <XCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Order Not Found</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{error || 'This order does not exist.'}</p>
          <Link to="/orders" className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors">
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  const sc = statusConfig[order.status] || statusConfig.confirmed
  const StatusIcon = sc.icon
  const currentStepIdx = statusSteps.indexOf(order.status)
  const paymentLabels = { cod: 'Cash on Delivery', upi: 'UPI', card: 'Credit / Debit Card', whatsapp: 'WhatsApp Pay' }
  const canCancel = ['pending', 'confirmed'].includes(order.status)

  const handleCancel = async () => {
    setCancelLoading(true)
    try {
      const res = await api.cancelOrder(order._id)
      if (res.success) {
        setOrder({ ...order, status: 'cancelled' })
      } else {
        setError(res.error || 'Failed to cancel')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setCancelLoading(false)
      setShowCancelModal(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 px-4 pb-20">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <Link to="/orders" className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 mb-6 text-sm font-medium transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">{order.orderNumber}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border ${sc.color}`}>
                <StatusIcon className="w-4 h-4" />
                {sc.label}
              </div>
              {canCancel && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border border-red-200 dark:border-red-800 text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel Order
                </button>
              )}
            </div>
          </div>

          {/* Progress tracker (only for non-cancelled) */}
          {order.status !== 'cancelled' && order.status !== 'pending' && (
            <div className="flex items-center justify-between mb-2">
              {statusSteps.map((s, i) => {
                const done = i <= currentStepIdx
                return (
                  <div key={s} className="flex items-center flex-1 last:flex-none">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      done ? 'bg-sky-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                    }`}>
                      {i + 1}
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div className={`h-0.5 flex-1 mx-2 ${i < currentStepIdx ? 'bg-sky-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
                    )}
                  </div>
                )
              })}
            </div>
          )}
          {order.status !== 'cancelled' && order.status !== 'pending' && (
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              {statusSteps.map(s => <span key={s} className="capitalize">{s}</span>)}
            </div>
          )}

          {order.estimatedDelivery && order.status !== 'delivered' && order.status !== 'cancelled' && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
              Estimated delivery:{' '}
              <span className="font-semibold text-slate-800 dark:text-white">
                {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </p>
          )}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Shipping Address */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-600" />
              Shipping Address
            </h3>
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <p className="font-semibold text-slate-800 dark:text-white">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
              <p>{order.shippingAddress?.country}</p>
              <p className="pt-1">Phone: {order.shippingAddress?.phone}</p>
            </div>
          </motion.div>

          {/* Payment */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-sky-600" />
              Payment
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{paymentLabels[order.paymentMethod] || order.paymentMethod}</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>₹{order.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-800 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Total</span>
                <span>₹{order.total?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Items */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-sky-600" />
            Items ({order.items?.length})
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{item.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {item.brand && <span className="text-xs text-slate-500 dark:text-slate-400">{item.brand}</span>}
                    {item.category && <span className="text-xs text-slate-400">• {item.category}</span>}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}</p>
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-white whitespace-nowrap">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Cancel Confirmation Modal */}
        <AnimatePresence>
          {showCancelModal && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => !cancelLoading && setShowCancelModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Cancel Order?</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">This action cannot be undone.</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  Are you sure you want to cancel order <strong className="text-slate-800 dark:text-white">{order.orderNumber}</strong>? Your refund will be processed within 5-7 business days.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    disabled={cancelLoading}
                    className="flex-1 py-3 rounded-xl font-semibold text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    Keep Order
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={cancelLoading}
                    className="flex-1 py-3 rounded-xl font-semibold text-sm bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-60"
                  >
                    {cancelLoading ? 'Cancelling...' : 'Yes, Cancel'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default OrderDetail
