import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, ChevronRight, ShoppingBag, Truck, CheckCircle2, Clock, XCircle, Box, AlertTriangle } from 'lucide-react'
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

const Orders = () => {
  const { isAuthenticated } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelTarget, setCancelTarget] = useState(null)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.getOrders()
        setOrders(res.data || [])
      } catch (err) {
        setError(err.message || 'Failed to load orders')
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) fetchOrders()
    else setLoading(false)
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 px-4">
        <div className="max-w-md mx-auto text-center py-20">
          <Package className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Login Required</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Sign in to view your orders.</p>
          <Link
            to="/login"
            state={{ from: '/orders' }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 px-4 pb-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-8 flex items-center gap-3">
          <Package className="w-7 h-7 text-sky-600" />
          My Orders
        </h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32" />
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-24" />
                </div>
                <div className="flex gap-3">
                  {[1, 2].map(j => (
                    <div key={j} className="w-14 h-14 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Orders Yet</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Start shopping and your orders will appear here.</p>
            <Link to="/#catalog" className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, idx) => {
              const sc = statusConfig[order.status] || statusConfig.confirmed
              const StatusIcon = sc.icon

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{order.orderNumber}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${sc.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {sc.label}
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-1">
                    {order.items.slice(0, 4).map((item, i) => (
                      <img
                        key={i}
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-slate-200 dark:border-slate-700"
                      />
                    ))}
                    {order.items.length > 4 && (
                      <div className="w-14 h-14 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 text-sm font-bold text-slate-500">
                        +{order.items.length - 4}
                      </div>
                    )}
                    <div className="flex-1" />
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-white">₹{order.total.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-slate-500">{order.items.reduce((s, i) => s + i.quantity, 0)} items</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                    {order.estimatedDelivery && order.status !== 'delivered' && order.status !== 'cancelled' ? (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Estimated delivery:{' '}
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short',
                          })}
                        </span>
                      </p>
                    ) : order.status === 'delivered' ? (
                      <p className="text-xs text-emerald-600 font-semibold">Delivered</p>
                    ) : (
                      <span />
                    )}
                    <Link
                      to={`/orders/${order._id}`}
                      className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors"
                    >
                      View Details <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Cancel button for cancellable orders */}
                  {['pending', 'confirmed'].includes(order.status) && (
                    <div className="pt-3">
                      <button
                        onClick={() => setCancelTarget(order)}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold border border-red-200 dark:border-red-800 text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel Order
                      </button>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        <AnimatePresence>
          {cancelTarget && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => !cancelLoading && setCancelTarget(null)}
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
                  Are you sure you want to cancel order <strong className="text-slate-800 dark:text-white">{cancelTarget.orderNumber}</strong>?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCancelTarget(null)}
                    disabled={cancelLoading}
                    className="flex-1 py-3 rounded-xl font-semibold text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    Keep Order
                  </button>
                  <button
                    onClick={async () => {
                      setCancelLoading(true)
                      try {
                        const res = await api.cancelOrder(cancelTarget._id)
                        if (res.success) {
                          setOrders(prev => prev.map(o => o._id === cancelTarget._id ? { ...o, status: 'cancelled' } : o))
                        }
                      } catch (err) {
                        // silently ignore
                      } finally {
                        setCancelLoading(false)
                        setCancelTarget(null)
                      }
                    }}
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

export default Orders
