import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star, Heart, Camera, ShoppingCart, ShoppingBag, Box, QrCode,
  ChevronRight, ChevronDown, ChevronUp, X, SlidersHorizontal, Search
} from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import Product3DViewer from './Product3DViewer'
import QRCodeModal from './QRCodeModal'
import { getDiscountPercent, sortByDiscount } from '../utils/price'

// ─── Category metadata ───
const categoryMeta = {
  shoes:   { label: 'Shoes',   parent: 'Footwear',    icon: '👟' },
  bags:    { label: 'Bags',    parent: 'Accessories',  icon: '👜' },
  clothes: { label: 'Clothes', parent: 'Clothing',     icon: '👕' },
  watches: { label: 'Watches', parent: 'Accessories',  icon: '⌚' },
  books:   { label: 'Books',   parent: 'Stationery',   icon: '📚' },
}

// Dynamic fallback for any slug not in the map above
const getMeta = (slug) => categoryMeta[slug] || {
  label: slug.charAt(0).toUpperCase() + slug.slice(1),
  parent: 'Shop',
  icon: '🛍️',
}

// ─── Price range buckets ───
const priceRanges = [
  { label: 'Under ₹3,000',       min: 0,     max: 3000   },
  { label: '₹3,000 – ₹7,000',   min: 3000,  max: 7000   },
  { label: '₹7,000 – ₹15,000',  min: 7000,  max: 15000  },
  { label: '₹15,000 – ₹30,000', min: 15000, max: 30000  },
  { label: 'Over ₹30,000',      min: 30000, max: Infinity },
]

// ─── Rating buckets ───
const ratingOptions = [4, 3, 2, 1]

// ─── Sort options ───
const sortOptions = [
  { value: 'default',     label: 'Recommended' },
  { value: 'price-low',   label: 'Price: Low to High' },
  { value: 'price-high',  label: 'Price: High to Low' },
  { value: 'rating',      label: 'Customer Rating' },
  { value: 'discount',    label: 'Better Discount' },
  { value: 'new',         label: 'What\'s New' },
]

const CategoryPage = ({ onTryOn }) => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addToCart, isInWishlist, toggleWishlistItem, isInCart } = useCart()

  // ─── State ───
  const [sortBy, setSortBy] = useState('default')
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([])
  const [selectedRatings, setSelectedRatings] = useState([])
  const [searchBrand, setSearchBrand] = useState('')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    categories: true, brand: true, price: true, rating: true,
  })

  // 3D / QR modals
  const [selected3DProduct, setSelected3DProduct] = useState(null)
  const [show3DViewer, setShow3DViewer] = useState(false)
  const [selectedQRProduct, setSelectedQRProduct] = useState(null)
  const [showQRModal, setShowQRModal] = useState(false)

  // Scroll to top on category change
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [slug])

  // Reset filters when category changes
  useEffect(() => {
    setSelectedBrands([])
    setSelectedPriceRanges([])
    setSelectedRatings([])
    setSortBy('default')
    setSearchBrand('')
  }, [slug])

  // ─── Derived data ───
  const meta = getMeta(slug)

  // Fetch products from API (falls back to local data)
  const { products: allProducts, loading } = useProducts()

  const categoryProducts = useMemo(
    () => allProducts.filter(p => p.category === slug),
    [allProducts, slug]
  )

  // Unique brands in this category
  const brands = useMemo(() => {
    const b = {}
    categoryProducts.forEach(p => {
      b[p.brand] = (b[p.brand] || 0) + 1
    })
    return Object.entries(b).sort((a, b) => b[1] - a[1]) // [[brand, count], ...]
  }, [categoryProducts])

  const filteredBrands = brands.filter(([name]) =>
    name.toLowerCase().includes(searchBrand.toLowerCase())
  )

  // ─── Apply filters ───
  const filteredProducts = useMemo(() => {
    let result = [...categoryProducts]

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand))
    }

    // Price filter
    if (selectedPriceRanges.length > 0) {
      result = result.filter(p =>
        selectedPriceRanges.some(idx => {
          const range = priceRanges[idx]
          return p.price >= range.min && p.price <= range.max
        })
      )
    }

    // Rating filter
    if (selectedRatings.length > 0) {
      result = result.filter(p =>
        selectedRatings.some(r => p.rating >= r)
      )
    }

    // Sort
    if (sortBy === 'price-low')  result.sort((a, b) => a.price - b.price)
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price)
    if (sortBy === 'rating')     result.sort((a, b) => b.rating - a.rating)
    if (sortBy === 'discount')   result.sort(sortByDiscount)

    return result
  }, [categoryProducts, selectedBrands, selectedPriceRanges, selectedRatings, sortBy])

  // ─── Active filter chips ───
  const activeFilters = [
    ...selectedBrands.map(b => ({ type: 'brand', label: b, value: b })),
    ...selectedPriceRanges.map(i => ({ type: 'price', label: priceRanges[i].label, value: i })),
    ...selectedRatings.map(r => ({ type: 'rating', label: `${r}★ & above`, value: r })),
  ]

  const removeFilter = (filter) => {
    if (filter.type === 'brand')  setSelectedBrands(prev => prev.filter(b => b !== filter.value))
    if (filter.type === 'price')  setSelectedPriceRanges(prev => prev.filter(i => i !== filter.value))
    if (filter.type === 'rating') setSelectedRatings(prev => prev.filter(r => r !== filter.value))
  }

  const clearAllFilters = () => {
    setSelectedBrands([])
    setSelectedPriceRanges([])
    setSelectedRatings([])
  }

  const toggleSection = (key) =>
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }))

  // ─── Sidebar filter panel (shared desktop + mobile) ───
  const FilterPanel = () => (
    <div className="space-y-6">
      {/* BRAND */}
      <FilterSection title="BRAND" sectionKey="brand" expanded={expandedSections.brand} toggle={toggleSection}>
        {brands.length > 4 && (
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search brand"
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              value={searchBrand}
              onChange={e => setSearchBrand(e.target.value)}
            />
          </div>
        )}
        {filteredBrands.map(([brand, count]) => (
          <label key={brand} className="flex items-center gap-2 py-1.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand)}
              onChange={() =>
                setSelectedBrands(prev =>
                  prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
                )
              }
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-sky-600 focus:ring-sky-500"
            />
            <span className="text-slate-700 dark:text-slate-300 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors text-sm">
              {brand}
            </span>
            <span className="ml-auto text-xs text-slate-400">({count})</span>
          </label>
        ))}
      </FilterSection>

      {/* PRICE */}
      <FilterSection title="PRICE" sectionKey="price" expanded={expandedSections.price} toggle={toggleSection}>
        {priceRanges.map((range, idx) => {
          const count = categoryProducts.filter(p => p.price >= range.min && p.price <= range.max).length
          if (count === 0) return null
          return (
            <label key={idx} className="flex items-center gap-2 py-1.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedPriceRanges.includes(idx)}
                onChange={() =>
                  setSelectedPriceRanges(prev =>
                    prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
                  )
                }
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-sky-600 focus:ring-sky-500"
              />
              <span className="text-slate-700 dark:text-slate-300 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors text-sm">
                {range.label}
              </span>
              <span className="ml-auto text-xs text-slate-400">({count})</span>
            </label>
          )
        })}
      </FilterSection>

      {/* CUSTOMER RATINGS */}
      <FilterSection title="CUSTOMER RATINGS" sectionKey="rating" expanded={expandedSections.rating} toggle={toggleSection}>
        {ratingOptions.map(r => {
          const count = categoryProducts.filter(p => p.rating >= r).length
          return (
            <label key={r} className="flex items-center gap-2 py-1.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedRatings.includes(r)}
                onChange={() =>
                  setSelectedRatings(prev =>
                    prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
                  )
                }
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-sky-600 focus:ring-sky-500"
              />
              <div className="flex items-center gap-1">
                <span className="text-sm text-slate-700 dark:text-slate-300">{r}</span>
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-slate-500 dark:text-slate-400">& above</span>
              </div>
              <span className="ml-auto text-xs text-slate-400">({count})</span>
            </label>
          )
        })}
      </FilterSection>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20">
      {/* ─── Breadcrumb ─── */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
        <div className="container mx-auto flex items-center text-sm text-slate-500 dark:text-slate-400 gap-1.5">
          <Link to="/" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/#catalog" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-800 dark:text-white">{meta.label}</span>
        </div>
      </div>

      {/* ─── Page header ─── */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-4">
        <div className="container mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              {meta.label}
              <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-2">
                – {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''}
              </span>
            </h1>
          </div>
          {/* Sort dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:inline">Sort by :</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent cursor-pointer font-medium"
            >
              {sortOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ─── Active filter chips ─── */}
      {activeFilters.length > 0 && (
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-2.5">
          <div className="container mx-auto flex flex-wrap items-center gap-2">
            {activeFilters.map((f, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-700"
              >
                {f.label}
                <button
                  onClick={() => removeFilter(f)}
                  className="ml-0.5 hover:text-red-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-red-500 hover:text-red-600 ml-2 uppercase tracking-wide"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* ─── Main layout: sidebar + grid ─── */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide">Filters</h2>
                {activeFilters.length > 0 && (
                  <button onClick={clearAllFilters} className="text-xs font-semibold text-red-500 hover:text-red-600 uppercase">
                    Clear All
                  </button>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Mobile filter button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-5 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full shadow-xl font-semibold text-sm hover:scale-105 transition-transform"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
          </button>

          {/* Mobile filter drawer */}
          <AnimatePresence>
            {mobileFilterOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black z-40"
                  onClick={() => setMobileFilterOpen(false)}
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'tween', duration: 0.3 }}
                  className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-slate-800 z-50 overflow-y-auto shadow-2xl"
                >
                  <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase">Filters</h2>
                    <button onClick={() => setMobileFilterOpen(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                      <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </button>
                  </div>
                  <div className="p-4">
                    <FilterPanel />
                  </div>
                  <div className="sticky bottom-0 p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex gap-3">
                    <button
                      onClick={clearAllFilters}
                      className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold text-sm"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setMobileFilterOpen(false)}
                      className="flex-1 py-3 rounded-xl bg-sky-600 text-white font-semibold text-sm hover:bg-sky-700 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* ─── Product Grid ─── */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 animate-pulse">
                    <div className="aspect-[3/4] bg-slate-200 dark:bg-slate-700" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-6xl mb-4">🔍</p>
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">No products found</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">Try adjusting your filters</p>
                <button onClick={clearAllFilters} className="px-6 py-2 bg-sky-600 text-white rounded-xl font-semibold text-sm hover:bg-sky-700 transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.03 }}
                    className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group border border-slate-100 dark:border-slate-700"
                  >
                    {/* Product Image */}
                    <div
                      className="relative overflow-hidden aspect-[3/4] bg-slate-100 dark:bg-slate-700 cursor-pointer"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                        <button
                          onClick={() => { setSelectedQRProduct(product); setShowQRModal(true) }}
                          className="bg-emerald-600 text-white p-2.5 rounded-full hover:bg-emerald-700 transition-all hover:scale-110"
                          title="QR Code"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setSelected3DProduct(product); setShow3DViewer(true) }}
                          className="bg-purple-600 text-white p-2.5 rounded-full hover:bg-purple-700 transition-all hover:scale-110"
                          title="View in 3D"
                        >
                          <Box className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onTryOn(product)}
                          className="bg-sky-600 text-white p-2.5 rounded-full hover:bg-sky-700 transition-all hover:scale-110"
                          title="Try with AR"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Wishlist */}
                      <button
                        onClick={() => toggleWishlistItem(product)}
                        className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 shadow hover:scale-110 transition-all z-10"
                      >
                        <Heart className={`w-4 h-4 transition-colors ${
                          isInWishlist(product.id)
                            ? 'text-red-500 fill-red-500'
                            : 'text-gray-400 dark:text-slate-400'
                        }`} />
                      </button>

                      {/* Badge */}
                      {product.badge && (
                        <div className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wide ${
                          product.badge === 'Sale' ? 'bg-red-500' :
                          product.badge === 'New' ? 'bg-emerald-500' :
                          product.badge === 'Bestseller' ? 'bg-amber-500' :
                          product.badge === 'Trending' ? 'bg-purple-500' :
                          'bg-sky-500'
                        }`}>
                          {product.badge}
                        </div>
                      )}

                      {/* Rating pill — bottom left like Myntra */}
                      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-white/95 dark:bg-slate-800/95 px-2 py-1 rounded text-xs font-bold shadow">
                        <span className="text-slate-800 dark:text-white">{product.rating}</span>
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-slate-400 dark:text-slate-500 font-normal">|</span>
                        <span className="text-slate-500 dark:text-slate-400 font-normal">{product.reviewCount >= 1000 ? `${(product.reviewCount / 1000).toFixed(1)}k` : product.reviewCount}</span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-3">
                      <p className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wide truncate">
                        {product.brand}
                      </p>
                      <p
                        className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5 cursor-pointer hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        {product.name}
                      </p>

                      {/* Price row */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice > product.price && (
                          <>
                            <span className="text-xs text-slate-400 line-through">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs font-semibold text-orange-500">
                              ({getDiscountPercent(product.price, product.originalPrice)}% OFF)
                            </span>
                          </>
                        )}
                      </div>

                      {/* Action buttons — compact */}
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => addToCart(product)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold text-xs transition-all ${
                            isInCart(product.id)
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700'
                              : 'bg-sky-600 text-white hover:bg-sky-700'
                          }`}
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          {isInCart(product.id) ? 'Added' : 'Add to Cart'}
                        </button>
                        <button
                          onClick={() => onTryOn(product)}
                          className="px-3 py-2 rounded-lg text-xs font-semibold border border-sky-500 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors"
                          title="AR Try-On"
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
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
    </div>
  )
}

// ─── Collapsible filter section ───
const FilterSection = ({ title, sectionKey, expanded, toggle, children }) => (
  <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
    <button
      onClick={() => toggle(sectionKey)}
      className="flex items-center justify-between w-full mb-2 group"
    >
      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
        {title}
      </h3>
      {expanded
        ? <ChevronUp className="w-4 h-4 text-slate-400" />
        : <ChevronDown className="w-4 h-4 text-slate-400" />
      }
    </button>
    <AnimatePresence>
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)

export default CategoryPage
