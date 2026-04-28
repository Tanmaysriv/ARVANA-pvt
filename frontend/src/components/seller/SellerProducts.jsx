import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Package, X, Search, Upload, Image as ImageIcon, Link as LinkIcon } from 'lucide-react'
import api from '../../services/api'

const emptyProduct = {
  name: '', brand: '', category: '', price: '', originalPrice: '',
  description: '', image: '', rating: 0, reviewCount: 0,
  colors: '', sizes: '', badge: '', stock: 0, glbModel: ''
}

const SellerProducts = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyProduct)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [imageMode, setImageMode] = useState('upload')
  const [glbMode, setGlbMode] = useState('url')
  const fileInputRef = useRef(null)
  const glbInputRef = useRef(null)

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

  const loadCategories = async () => {
    try {
      const res = await api.seller.getCategories()
      if (res.success) setCategories(res.data || [])
    } catch (err) {
      console.error('Failed to load categories:', err)
    }
  }

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyProduct, category: categories[0]?.name || '' })
    setError('')
    setImageMode('upload')
    setShowModal(true)
  }

  const openEdit = (product) => {
    setEditing(product)
    setForm({
      name: product.name || '',
      brand: product.brand || '',
      category: product.category || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      description: product.description || '',
      image: product.image || '',
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      colors: (product.colors || []).join(', '),
      sizes: (product.sizes || []).join(', '),
      badge: product.badge || '',
      stock: product.stock || 0,
      glbModel: product.glbModel || '',
    })
    setError('')
    setImageMode(product.image ? 'url' : 'upload')
    setGlbMode(product.glbModel ? 'url' : 'upload')
    setShowModal(true)
  }

  const handleImageUpload = async (file, isGlb = false) => {
    if (!file) return
    const maxMb = isGlb ? 50 : 5
    if (file.size > maxMb * 1024 * 1024) {
      setError(`${isGlb ? '3D Model' : 'Image'} must be under ${maxMb}MB`)
      return
    }
    setUploading(true)
    setError('')
    try {
      const res = await api.seller.uploadImage(file)
      if (isGlb) {
        setForm(f => ({ ...f, glbModel: res.data.url }))
      } else {
        setForm(f => ({ ...f, image: res.data.url }))
      }
    } catch (err) {
      setError(err.message || `Failed to upload ${isGlb ? '3D Model' : 'image'}`)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e, isGlb = false) => {
    e.preventDefault()
    const file = e.dataTransfer?.files?.[0]
    if (file) handleImageUpload(file, isGlb)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.brand.trim() || !form.price || !form.originalPrice || !form.description.trim() || !form.image.trim()) {
      setError('Please fill in all required fields (name, brand, price, original price, description, image)')
      return
    }
    if (!form.category) {
      setError('Please select a category')
      return
    }

    setSaving(true)
    setError('')

    try {
      const payload = {
        name: form.name.trim(),
        brand: form.brand.trim(),
        category: form.category,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice),
        description: form.description.trim(),
        image: form.image.trim(),
        rating: Number(form.rating) || 0,
        reviewCount: Number(form.reviewCount) || 0,
        colors: form.colors ? form.colors.split(',').map(c => c.trim()).filter(Boolean) : [],
        sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
        badge: form.badge.trim() || null,
        stock: Math.max(0, Number(form.stock) || 0),
        glbModel: form.glbModel?.trim() || null,
      }

      if (editing) {
        await api.seller.updateProduct(editing._id, payload)
      } else {
        await api.seller.createProduct(payload)
      }

      setShowModal(false)
      loadProducts()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await api.seller.deleteProduct(id)
      setProducts(prev => prev.filter(p => p._id !== id))
    } catch (err) {
      alert(`Failed to delete: ${err.message}`)
    }
  }

  const filtered = products.filter(p =>
    !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Products</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{products.length} product{products.length !== 1 ? 's' : ''} in your catalog</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search your products..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-white dark:bg-slate-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {search ? 'No products match your search' : 'No products yet. Add your first product!'}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(product => (
            <motion.div
              key={product._id}
              layout
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-40 bg-slate-100 dark:bg-slate-800">
                <img src={product.image?.startsWith('/uploads') ? `http://localhost:5000${product.image}` : product.image} alt={product.name} className="w-full h-full object-cover" />
                {product.badge && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-lg uppercase">
                    {product.badge}
                  </span>
                )}
                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">Out of Stock</span>
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded-lg">
                  <p className="text-xs text-white font-semibold">
                    📦 {product.stock || 0} in stock
                  </p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">{product.brand}</p>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mt-0.5 truncate">{product.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-bold text-slate-800 dark:text-white">₹{product.price?.toLocaleString('en-IN')}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-slate-400 line-through">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-slate-500 capitalize">{product.category}</span>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold ${
                        product.stock > 20 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                        product.stock > 0 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                        'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>
                        {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(product)}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-emerald-600 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id, product.name)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full max-h-[85vh] overflow-y-auto p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                  {editing ? 'Edit Product' : 'Add Product'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Name *</label>
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Brand *</label>
                    <input type="text" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Category *</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none capitalize">
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c._id || c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Price (₹) *</label>
                    <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Original Price (₹) *</label>
                    <input type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Product Image *</label>
                    <div className="flex rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700">
                      <button type="button" onClick={() => setImageMode('upload')}
                        className={`px-2.5 py-1 text-[10px] font-semibold flex items-center gap-1 transition-colors ${imageMode === 'upload' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                        <Upload className="w-3 h-3" /> Upload
                      </button>
                      <button type="button" onClick={() => setImageMode('url')}
                        className={`px-2.5 py-1 text-[10px] font-semibold flex items-center gap-1 transition-colors ${imageMode === 'url' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                        <LinkIcon className="w-3 h-3" /> URL
                      </button>
                    </div>
                  </div>

                  {imageMode === 'upload' ? (
                    <div
                      onDrop={e => handleDrop(e, false)}
                      onDragOver={e => e.preventDefault()}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                        uploading
                          ? 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10'
                          : 'border-slate-300 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600 bg-slate-50 dark:bg-slate-800'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={e => handleImageUpload(e.target.files?.[0], false)}
                      />
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                          <p className="text-xs text-emerald-600 font-medium">Uploading...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="w-8 h-8 text-slate-400" />
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Click to upload</span> or drag & drop
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500">JPEG, PNG, WebP, GIF (max 5MB)</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <input type="text" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  )}

                  {form.image && (
                    <div className="mt-2 relative inline-block">
                      <img
                        src={form.image.startsWith('/uploads') ? `http://localhost:5000${form.image}` : form.image}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                        onError={e => { e.target.style.display = 'none' }}
                      />
                      <button type="button" onClick={() => setForm(f => ({ ...f, image: '' }))}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Description *</label>
                  <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none" />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Colors (comma separated)</label>
                    <input type="text" value={form.colors} onChange={e => setForm(f => ({ ...f, colors: e.target.value }))} placeholder="Black, White, Red"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Sizes (comma separated)</label>
                    <input type="text" value={form.sizes} onChange={e => setForm(f => ({ ...f, sizes: e.target.value }))} placeholder="S, M, L, XL"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Badge</label>
                    <input type="text" value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} placeholder="New, Sale, etc."
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Rating (0-5)</label>
                    <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Stock Quantity</label>
                    <input type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="100"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">GLB Model (Optional 3D View)</label>
                    <div className="flex rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700">
                      <button type="button" onClick={() => setGlbMode('upload')}
                        className={`px-2.5 py-1 text-[10px] font-semibold flex items-center gap-1 transition-colors ${glbMode === 'upload' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                        <Upload className="w-3 h-3" /> Upload
                      </button>
                      <button type="button" onClick={() => setGlbMode('url')}
                        className={`px-2.5 py-1 text-[10px] font-semibold flex items-center gap-1 transition-colors ${glbMode === 'url' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                        <LinkIcon className="w-3 h-3" /> URL
                      </button>
                    </div>
                  </div>

                  {glbMode === 'upload' ? (
                    <div
                      onDrop={e => handleDrop(e, true)}
                      onDragOver={e => e.preventDefault()}
                      onClick={() => glbInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                        uploading
                          ? 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10'
                          : 'border-slate-300 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600 bg-slate-50 dark:bg-slate-800'
                      }`}
                    >
                      <input
                        ref={glbInputRef}
                        type="file"
                        accept=".glb,.gltf"
                        className="hidden"
                        onChange={e => handleImageUpload(e.target.files?.[0], true)}
                      />
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                          <p className="text-xs text-emerald-600 font-medium">Uploading...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="w-8 h-8 text-slate-400" />
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Click to upload</span> or drag & drop
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500">GLB, GLTF (max 50MB)</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <input type="text" value={form.glbModel} onChange={e => setForm(f => ({ ...f, glbModel: e.target.value }))} placeholder="https://example.com/model.glb"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  )}
                  {form.glbModel && glbMode === 'upload' && (
                    <div className="mt-2 flex items-center justify-between p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                      <span className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-[200px]">{form.glbModel.split('/').pop()}</span>
                      <button type="button" onClick={() => setForm(f => ({ ...f, glbModel: '' }))} className="text-red-500 hover:text-red-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-[2] py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-semibold rounded-xl transition-colors">
                  {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SellerProducts
