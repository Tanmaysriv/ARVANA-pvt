import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Heart, Box, QrCode, ShoppingCart, ShoppingBag, Star, SlidersHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProducts, useCategories } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import Product3DViewer from './Product3DViewer'
import QRCodeModal from './QRCodeModal'
import { getDiscountPercent, sortByDiscount } from '../utils/price'

const COLOR_MAP = {
  white:      '#ffffff', black:     '#000000', red:       '#ef4444',
  blue:       '#3b82f6', gray:      '#6b7280', brown:     '#92400e',
  navy:       '#1e3a8a', tan:       '#d2b48c', floral:    '#ec4899',
  silver:     '#c0c0c0', gold:      '#ffd700', 'rose gold':'#b76e79',
  'light blue':'#93c5fd',
}

const BADGE_STYLES = {
  Sale:       'bg-rose-500',
  New:        'bg-emerald-500',
  Bestseller: 'bg-amber-500',
  Trending:   'bg-violet-500',
}

const ProductCard = ({ product, index, onTryOn, handle3DView, handleQRCode }) => {
  const navigate = useNavigate()
  const { addToCart, isInWishlist, toggleWishlistItem, isInCart } = useCart()
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ 
        duration: 0.5, 
        delay: (index % 8) * 0.08, 
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative bg-white dark:bg-obsidian-900 rounded-2xl border border-slate-100 dark:border-white/5
                 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/20 dark:hover:shadow-primary-500/10"
    >
      {/* ── Image ── */}
      <div
        className="relative overflow-hidden aspect-[4/5] cursor-pointer bg-gradient-to-br from-slate-50 to-slate-100 dark:from-obsidian-800 dark:to-obsidian-900"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1.12 : 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Dark gradient overlay — always subtle */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Shine effect on hover */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
          animate={{ opacity: hovered ? [0, 0.3, 0] : 0 }}
          transition={{ duration: 0.6 }}
        />

        {/* ── AR / 3D / QR action tray ── */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute bottom-4 left-3 right-3 flex items-center justify-center gap-2.5 pointer-events-none z-20"
            >
              <motion.button
                onClick={e => { e.stopPropagation(); handleQRCode(product) }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="pointer-events-auto flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 backdrop-blur-md text-white text-[11px] font-bold px-3.5 py-2 rounded-full hover:shadow-lg shadow-emerald-500/50 transition-all"
                title="QR Code"
              >
                <QrCode className="w-3.5 h-3.5" /> QR
              </motion.button>
              <motion.button
                onClick={e => { e.stopPropagation(); handle3DView(product) }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="pointer-events-auto flex items-center gap-1.5 bg-gradient-to-r from-violet-500 to-purple-600 backdrop-blur-md text-white text-[11px] font-bold px-3.5 py-2 rounded-full hover:shadow-lg shadow-violet-500/50 transition-all"
                title="3D View"
              >
                <Box className="w-3.5 h-3.5" /> 3D
              </motion.button>
              <motion.button
                onClick={e => { e.stopPropagation(); onTryOn(product) }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="pointer-events-auto flex items-center gap-1.5 bg-gradient-to-r from-primary-500 to-amber-500 backdrop-blur-md text-white text-[11px] font-bold px-3.5 py-2 rounded-full hover:shadow-lg shadow-primary-500/50 transition-all"
                title="AR Try-On"
              >
                <Camera className="w-3.5 h-3.5" /> AR Try
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Wishlist ── */}
        <motion.button
          onClick={e => { e.stopPropagation(); toggleWishlistItem(product) }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/95 dark:bg-obsidian-900/95 shadow-lg hover:shadow-2xl
                     flex items-center justify-center backdrop-blur-sm border border-white/20 dark:border-white/5 transition-all duration-200"
        >
          <Heart className={`w-4.5 h-4.5 transition-colors ${isInWishlist(product.id) ? 'text-rose-500 fill-rose-500' : 'text-slate-400 dark:text-slate-500'}`} />
        </motion.button>

        {/* ── Badge ── */}
        {product.badge && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-bold text-white tracking-wider ${BADGE_STYLES[product.badge] || 'bg-primary-500'} shadow-lg`}
          >
            {product.badge}
          </motion.div>
        )}

        {/* ── Discount ── */}
        {product.originalPrice > product.price && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="absolute bottom-4 left-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-lg"
          >
            -{getDiscountPercent(product.price, product.originalPrice)}%
          </motion.div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="p-5 space-y-3">
        {/* Brand */}
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[10px] font-bold text-primary-500 dark:text-primary-400 uppercase tracking-widest"
        >
          {product.brand}
        </motion.p>

        {/* Name */}
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="font-semibold text-base text-slate-900 dark:text-white line-clamp-1 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-sora"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          {product.name}
        </motion.h3>

        {/* Rating */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 mb-1"
        >
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-slate-700'}`} />
            ))}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {product.rating} ({product.reviewCount?.toLocaleString?.() || '0'})
          </span>
        </motion.div>

        {/* Price */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="flex items-baseline gap-2"
        >
          <span className="text-2xl font-bold text-slate-900 dark:text-white font-sora">
            ₹{product.price?.toLocaleString('en-IN')}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-slate-400 line-through">
              ₹{product.originalPrice?.toLocaleString('en-IN')}
            </span>
          )}
        </motion.div>

        {/* Color dots */}
        {product.colors?.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex gap-2 mb-4"
          >
            {product.colors.slice(0, 4).map((color, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                title={color}
                className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 ring-0 hover:ring-2 ring-primary-400 ring-offset-1 dark:ring-offset-obsidian-900 cursor-pointer transition-all shadow-sm"
                style={{ backgroundColor: COLOR_MAP[color.toLowerCase()] || '#9ca3af' }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-slate-400 self-center font-semibold">+{product.colors.length - 4}</span>
            )}
          </motion.div>
        )}

        {/* Add to Cart */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => addToCart(product)}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
            isInCart(product.id)
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
              : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30 hover:shadow-xl hover:from-primary-600 hover:to-primary-700'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {isInCart(product.id) ? 'Added to Cart' : 'Add to Cart'}
        </motion.button>

        {/* Buy Now */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { addToCart(product); navigate('/checkout') }}
          className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2
                     bg-gradient-to-r from-obsidian-900 to-obsidian-800 dark:from-white dark:to-slate-100 
                     text-white dark:text-obsidian-950
                     hover:shadow-xl transition-all duration-200"
        >
          <ShoppingBag className="w-4 h-4" />
          Buy Now
        </motion.button>
      </div>
    </motion.div>
  )
}

const ProductCatalog = ({ onTryOn }) => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selected3DProduct, setSelected3DProduct] = useState(null)
  const [show3DViewer, setShow3DViewer]   = useState(false)
  const [selectedQRProduct, setSelectedQRProduct] = useState(null)
  const [showQRModal, setShowQRModal]     = useState(false)
  const [sortBy, setSortBy]               = useState('default')
  const [showSort, setShowSort]           = useState(false)

  const { products, loading } = useProducts()
  const { categories }        = useCategories()

  const handle3DView  = p => { setSelected3DProduct(p); setShow3DViewer(true) }
  const handleQRCode  = p => { setSelectedQRProduct(p); setShowQRModal(true) }

  const filteredProducts = useMemo(() => {
    let data = selectedCategory === 'all' ? [...products] : products.filter(p => p.category === selectedCategory)
    if (sortBy === 'price-low')  data.sort((a, b) => a.price - b.price)
    if (sortBy === 'price-high') data.sort((a, b) => b.price - a.price)
    if (sortBy === 'rating')     data.sort((a, b) => b.rating - a.rating)
    if (sortBy === 'discount')   data.sort(sortByDiscount)
    return data
  }, [products, selectedCategory, sortBy])

  const SORT_LABELS = {
    default:     'Default',
    'price-low': 'Price ↑',
    'price-high':'Price ↓',
    rating:      'Top Rated',
    discount:    'Best Deal',
  }

  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-obsidian-900 relative">
      {/* Section top separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="section-eyebrow mb-4 inline-flex">Our Collection</span>
          <h2 className="text-4xl md:text-5xl font-bold font-sora text-slate-900 dark:text-white mb-3">
            Shop Our <span className="gradient-text">Collection</span>
          </h2>
          <p className="text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Find your perfect style — try before you buy with live AR
          </p>
        </motion.div>

        {/* ── Category Filter Pills ── */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-8">
          {categories.map(cat => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-250 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-primary-500 to-violet-600 text-white shadow-glow-sm'
                  : 'bg-white dark:bg-obsidian-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08] hover:border-primary-300 dark:hover:border-primary-500/40'
              }`}
            >
              <span className="mr-1.5">{cat.icon}</span>
              {cat.name}
            </motion.button>
          ))}
        </div>

        {/* ── Sort / Count Bar ── */}
        <div className="flex justify-between items-center mb-7 px-1">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <span className="text-slate-900 dark:text-white font-semibold">{filteredProducts.length}</span> products
          </p>

          {/* Custom Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSort(s => !s)}
              className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300
                         bg-white dark:bg-obsidian-800 border border-slate-200 dark:border-white/[0.08]
                         px-4 py-2 rounded-xl hover:border-primary-300 dark:hover:border-primary-500/40 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {SORT_LABELS[sortBy]}
            </button>
            <AnimatePresence>
              {showSort && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-obsidian-800 rounded-xl shadow-xl border border-slate-100 dark:border-white/[0.08] py-1.5 z-30"
                >
                  {Object.entries(SORT_LABELS).map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => { setSortBy(val); setShowSort(false) }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sortBy === val
                          ? 'text-primary-500 font-semibold bg-primary-50 dark:bg-primary-500/10'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Product Grid ── */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white dark:bg-obsidian-800 animate-pulse border border-slate-100 dark:border-white/5">
                <div className="aspect-[4/5] bg-slate-100 dark:bg-obsidian-700 rounded-t-2xl" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-slate-100 dark:bg-obsidian-700 rounded w-1/3" />
                  <div className="h-4 bg-slate-100 dark:bg-obsidian-700 rounded w-3/4" />
                  <div className="h-6 bg-slate-100 dark:bg-obsidian-700 rounded w-1/2" />
                  <div className="h-9 bg-slate-100 dark:bg-obsidian-700 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onTryOn={onTryOn}
                handle3DView={handle3DView}
                handleQRCode={handleQRCode}
              />
            ))}
          </div>
        )}
      </div>

      {/* 3D Viewer */}
      <Product3DViewer
        product={selected3DProduct}
        isOpen={show3DViewer}
        onClose={() => setShow3DViewer(false)}
      />
      {/* QR Modal */}
      <QRCodeModal
        product={selectedQRProduct}
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
      />
    </section>
  )
}

export default ProductCatalog
