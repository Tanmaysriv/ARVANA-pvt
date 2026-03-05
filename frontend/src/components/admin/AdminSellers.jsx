import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Store, CheckCircle2, XCircle, Clock, Search, ShieldCheck, ShieldX, Package, IndianRupee } from 'lucide-react'
import api from '../../services/api'

const statusBadge = {
  approved: { label: 'Approved', cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', icon: ShieldCheck },
  pending: { label: 'Pending', cls: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
  blocked: { label: 'Blocked', cls: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: ShieldX },
}

const AdminSellers = () => {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const loadSellers = async () => {
    try {
      setLoading(true)
      const res = await api.admin.getSellers()
      if (res.success) setSellers(res.data || [])
    } catch (err) {
      console.error('Failed to load sellers:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadSellers() }, [])

  const handleStatusUpdate = async (sellerId, newStatus) => {
    const action = newStatus === 'approved' ? 'approve' : newStatus === 'blocked' ? 'block' : 'set pending'
    if (!confirm(`Are you sure you want to ${action} this seller?`)) return

    try {
      setUpdatingId(sellerId)
      const res = await api.admin.updateSellerStatus(sellerId, newStatus)
      if (res.success) {
        setSellers(prev => prev.map(s => s._id === sellerId ? { ...s, sellerStatus: newStatus } : s))
      }
    } catch (err) {
      alert(`Failed to update: ${err.message}`)
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = sellers.filter(s => {
    if (filter !== 'all' && s.sellerStatus !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.storeName?.toLowerCase().includes(q)
      )
    }
    return true
  })

  const counts = {
    all: sellers.length,
    pending: sellers.filter(s => s.sellerStatus === 'pending').length,
    approved: sellers.filter(s => s.sellerStatus === 'approved').length,
    blocked: sellers.filter(s => s.sellerStatus === 'blocked').length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Seller Management</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Approve, block, or manage seller accounts</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { key: 'all', label: 'Total', icon: Store, color: 'slate' },
          { key: 'pending', label: 'Pending', icon: Clock, color: 'yellow' },
          { key: 'approved', label: 'Approved', icon: CheckCircle2, color: 'emerald' },
          { key: 'blocked', label: 'Blocked', icon: XCircle, color: 'red' },
        ].map(({ key, label, icon: Icon, color }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`bg-white dark:bg-slate-900 rounded-xl border p-4 text-left transition-all ${
              filter === key
                ? 'border-sky-400 dark:border-sky-600 ring-2 ring-sky-200 dark:ring-sky-800'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{label}</span>
              <Icon className={`w-4 h-4 text-${color}-500`} />
            </div>
            <p className="text-xl font-bold text-slate-800 dark:text-white">{counts[key]}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search sellers by name, email, or store..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Sellers List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-white dark:bg-slate-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <Store className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {search ? 'No sellers match your search' : 'No sellers found'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((seller, i) => {
            const badge = statusBadge[seller.sellerStatus] || statusBadge.pending
            const BadgeIcon = badge.icon
            return (
              <motion.div
                key={seller._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Seller info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white truncate">{seller.storeName || 'Unnamed Store'}</h3>
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold flex items-center gap-1 ${badge.cls}`}>
                        <BadgeIcon className="w-3 h-3" />
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-medium text-slate-600 dark:text-slate-300">{seller.name}</span> · {seller.email}
                    </p>
                    {seller.gstNumber && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">GST: {seller.gstNumber}</p>
                    )}
                    {seller.storeDescription && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{seller.storeDescription}</p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs flex-shrink-0">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <Package className="w-3 h-3" />
                        <span>{seller.productCount || 0}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Products</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <IndianRupee className="w-3 h-3" />
                        <span>{(seller.revenue || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Revenue</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {seller.sellerStatus !== 'approved' && (
                      <button
                        onClick={() => handleStatusUpdate(seller._id, 'approved')}
                        disabled={updatingId === seller._id}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" /> Approve
                      </button>
                    )}
                    {seller.sellerStatus !== 'blocked' && (
                      <button
                        onClick={() => handleStatusUpdate(seller._id, 'blocked')}
                        disabled={updatingId === seller._id}
                        className="px-3 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-3 h-3" /> Block
                      </button>
                    )}
                    {seller.sellerStatus === 'blocked' && (
                      <button
                        onClick={() => handleStatusUpdate(seller._id, 'pending')}
                        disabled={updatingId === seller._id}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Unblock
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AdminSellers
