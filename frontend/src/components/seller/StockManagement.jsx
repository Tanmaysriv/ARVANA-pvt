import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Package, Search, RefreshCw } from 'lucide-react'
import api from '../../services/api'

export default function StockManagement() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState(null)
  const [filter, setFilter] = useState('all') // all, low, out

  const loadProducts = async () => {
    try {
      setLoading(true)
      const res = await api.seller.getProducts()
      if (res.success) setProducts(res.data || [])
    } catch (err) {
      console.error('Failed to load products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const updateStock = async (productId, newStock) => {
    if (newStock < 0) return
    setUpdating(productId)
    try {
      await api.seller.updateProduct(productId, { stock: newStock })
      setProducts(prev =>
        prev.map(p => p._id === productId ? { ...p, stock: newStock } : p)
      )
    } catch (err) {
      alert(`Failed to update stock: ${err.message}`)
    } finally {
      setUpdating(null)
    }
  }

  const addStock = (productId, amount) => {
    const product = products.find(p => p._id === productId)
    if (!product) return
    const currentStock = Number(product.stock) || 0
    updateStock(productId, Math.max(0, currentStock + amount))
  }

  const stats = {
    totalProducts: products.length,
    inStock: products.filter(p => (Number(p.stock) || 0) > 0).length,
    lowStock: products.filter(p => (Number(p.stock) || 0) > 0 && Number(p.stock) <= 20).length,
    outOfStock: products.filter(p => (Number(p.stock) || 0) <= 0).length,
    totalUnits: products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0),
  }

  let filtered = products
  if (search) {
    filtered = filtered.filter(p =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase())
    )
  }
  if (filter === 'low') {
    filtered = filtered.filter(p => (Number(p.stock) || 0) > 0 && (Number(p.stock) || 0) <= 20)
  } else if (filter === 'out') {
    filtered = filtered.filter(p => (Number(p.stock) || 0) <= 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Stock Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage inventory for all your products</p>
        </div>
        <button
          onClick={loadProducts}
          className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Total Products</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{stats.totalProducts}</p>
            </div>
            <Package className="w-8 h-8 text-slate-300 dark:text-slate-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">In Stock</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.inStock}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-emerald-300 dark:text-emerald-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{stats.lowStock}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-yellow-300 dark:text-yellow-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{stats.outOfStock}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-300 dark:text-red-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Total Units</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.totalUnits.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-300 dark:text-blue-600" />
          </div>
        </motion.div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-xs relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by product name or brand..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          />
        </div>

        <div className="flex gap-2">
          {['all', 'low', 'out'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors capitalize ${
                filter === f
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {f === 'all' ? 'All' : f === 'low' ? 'Low Stock' : 'Out of Stock'}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white dark:bg-slate-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {search ? 'No products match your search' : filter !== 'all' ? `No ${filter} stock items` : 'No products found'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 flex-wrap">
                {/* Image */}
                <img
                  src={product.image?.startsWith('/uploads') ? `http://localhost:5000${product.image}` : product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                />

                {/* Product Info */}
                <div className="flex-1 min-w-48">
                  <h3 className="font-semibold text-slate-800 dark:text-white text-sm">{product.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{product.brand} • {product.category}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">₹{product.price?.toLocaleString('en-IN')}</p>
                </div>

                {/* Stock Status Badge */}
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold ${
                    (Number(product.stock) || 0) > 20
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                      : (Number(product.stock) || 0) > 0
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {Number(product.stock) || 0} units
                  </span>
                </div>

                {/* Stock Controls */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => addStock(product._id, -10)}
                    disabled={updating === product._id}
                    className="px-2.5 py-1.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    -10
                  </button>
                  <button
                    onClick={() => addStock(product._id, -1)}
                    disabled={updating === product._id}
                    className="px-2.5 py-1.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    -1
                  </button>

                  <input
                    type="number"
                    min="0"
                    value={Number(product.stock) || 0}
                    onChange={e => updateStock(product._id, Math.max(0, Number(e.target.value)) || 0)}
                    disabled={updating === product._id}
                    className="w-20 px-2 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold text-center rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-50"
                  />

                  <button
                    onClick={() => addStock(product._id, 1)}
                    disabled={updating === product._id}
                    className="px-2.5 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => addStock(product._id, 10)}
                    disabled={updating === product._id}
                    className="px-2.5 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    +10
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
