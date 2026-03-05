import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, X, MapPin, Phone, User, Package, MessageCircle } from 'lucide-react'
import api from '../../services/api'

const statuses = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  processing: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  delivered: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

// Sellers can advance orders up to delivered
const nextStatusMap = {
  pending: 'confirmed',
  confirmed: 'processing',
  processing: 'shipped',
  shipped: 'delivered',
}

const SellerOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  const loadOrders = async (status = filter) => {
    try {
      setLoading(true)
      const res = await api.seller.getOrders({ status, limit: 50 })
      if (res.success) setOrders(res.data || [])
    } catch (err) {
      console.error('Failed to load orders:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [filter])

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId)
      const res = await api.seller.updateOrderStatus(orderId, newStatus)
      if (res.success) {
        // Reload orders since the response may have different shape
        await loadOrders()
        if (selectedOrder?._id === orderId) {
          setSelectedOrder(prev => ({ ...prev, status: newStatus }))
        }
      }
    } catch (err) {
      alert(`Failed to update: ${err.message}`)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Orders</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Orders containing your products</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors capitalize ${
              filter === s
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Order #</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Customer</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Your Items</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Payment</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-emerald-600 hover:text-emerald-700 font-semibold"
                      >
                        {order.orderNumber}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800 dark:text-white">{order.user?.name || 'Customer'}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase flex items-center gap-1">
                        {order.paymentMethod === 'whatsapp' && <MessageCircle className="w-3 h-3 text-green-600" />}
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusColors[order.status] || ''}`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3 px-4">
                      {nextStatusMap[order.status] && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, nextStatusMap[order.status])}
                          disabled={updatingId === order._id}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                        >
                          {updatingId === order._id ? '...' : `→ ${nextStatusMap[order.status].charAt(0).toUpperCase() + nextStatusMap[order.status].slice(1)}`}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">{selectedOrder.orderNumber}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Customer & Shipping info */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2 flex items-center gap-1">
                    <User className="w-3 h-3" /> Customer
                  </h3>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">{selectedOrder.user?.name || 'Customer'}</p>
                  <p className="text-xs text-slate-500">{selectedOrder.user?.email}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Shipping Address
                  </h3>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">{selectedOrder.shippingAddress?.fullName}</p>
                  <p className="text-xs text-slate-500">{selectedOrder.shippingAddress?.street}</p>
                  <p className="text-xs text-slate-500">
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <Phone className="w-3 h-3" /> {selectedOrder.shippingAddress?.phone}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${statusColors[selectedOrder.status]}`}>
                  {selectedOrder.status?.charAt(0).toUpperCase() + selectedOrder.status?.slice(1)}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium flex items-center gap-1">
                  {selectedOrder.paymentMethod === 'whatsapp' && <MessageCircle className="w-3 h-3 text-green-600" />}
                  Payment: {selectedOrder.paymentMethod}
                </span>
              </div>

              {/* Update status — sellers can advance to confirmed/processing/shipped/delivered */}
              {nextStatusMap[selectedOrder.status] && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {['confirmed', 'processing', 'shipped', 'delivered'].map(s => (
                    <button
                      key={s}
                      disabled={updatingId === selectedOrder._id || s === selectedOrder.status}
                      onClick={() => handleStatusUpdate(selectedOrder._id, s)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize disabled:opacity-40 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Items (only seller's items are shown by backend) */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-3 flex items-center gap-1">
                  <Package className="w-3 h-3" /> Your Items ({selectedOrder.items?.length})
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img
                        src={item.image?.startsWith('/uploads') ? `http://localhost:5000${item.image}` : item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{item.name}</p>
                        <p className="text-xs text-slate-500">Qty: {item.quantity} · ₹{item.price?.toLocaleString('en-IN')}</p>
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">₹{(item.price * item.quantity)?.toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SellerOrders
