import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, Package, Users, IndianRupee, TrendingUp, FolderTree } from 'lucide-react'
import api from '../../services/api'

const statCards = [
  { key: 'totalRevenue', label: 'Total Revenue', icon: IndianRupee, color: 'emerald', prefix: '₹', format: true },
  { key: 'recentRevenue', label: 'Last 30 Days', icon: TrendingUp, color: 'sky', prefix: '₹', format: true },
  { key: 'totalOrders', label: 'Total Orders', icon: ShoppingBag, color: 'violet' },
  { key: 'totalProducts', label: 'Products', icon: Package, color: 'amber' },
  { key: 'totalUsers', label: 'Users', icon: Users, color: 'rose' },
  { key: 'totalCategories', label: 'Categories', icon: FolderTree, color: 'cyan' },
]

const colorMap = {
  emerald: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600',
  sky: 'bg-sky-50 dark:bg-sky-900/30 text-sky-600',
  violet: 'bg-violet-50 dark:bg-violet-900/30 text-violet-600',
  amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600',
  rose: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600',
  cyan: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600',
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  processing: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  delivered: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          api.admin.getStats(),
          api.admin.getOrders({ limit: 5 }),
        ])
        if (statsRes.success) setStats(statsRes.data)
        if (ordersRes.success) setRecentOrders(ordersRes.data)
      } catch (err) {
        console.error('Failed to load dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-white dark:bg-slate-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Overview of your store</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map(({ key, label, icon: Icon, color, prefix, format }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">
              {prefix || ''}{format ? (stats?.[key] || 0).toLocaleString('en-IN') : stats?.[key] || 0}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Order Status Breakdown */}
      {stats?.statusCounts && Object.keys(stats.statusCounts).length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Orders by Status</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats.statusCounts).map(([status, count]) => (
              <div key={status} className={`px-4 py-2 rounded-xl text-sm font-semibold ${statusColors[status] || 'bg-slate-100 text-slate-700'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}: {count}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs text-sky-600 hover:text-sky-700 font-semibold">View All →</Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 py-8 text-center">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="text-left py-3 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Order</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Customer</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Total</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Status</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-2">
                      <Link to={`/admin/orders`} className="text-sky-600 hover:text-sky-700 font-semibold">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 px-2 text-slate-700 dark:text-slate-300">{order.user?.name || 'Unknown'}</td>
                    <td className="py-3 px-2 font-semibold text-slate-800 dark:text-white">₹{order.total?.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusColors[order.status] || ''}`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-500 dark:text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
