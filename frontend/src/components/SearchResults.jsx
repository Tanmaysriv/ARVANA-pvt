import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Star, Heart, ShoppingCart, Camera, Box, QrCode,
  Search, SlidersHorizontal, ChevronDown, X
} from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import Product3DViewer from './Product3DViewer'
import QRCodeModal from './QRCodeModal'
import { getDiscountPercent, sortByDiscount } from '../utils/price'

const sortOptions = [
  { value: 'default',    label: 'Relevance' },
  { value: 'price-low',  label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Customer Rating' },
  { value: 'discount',   label: 'Better Discount' },
]

const SearchResults = ({ onTryOn }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''
  const { addToCart, isInWishlist, toggleWishlistItem, isInCart } = useCart()

  const [sortBy, setSortBy] = useState('default')
  const [localQuery, setLocalQuery] = useState(query)

  // 3D / QR
  const [selected3DProduct, setSelected3DProduct] = useState(null)
  const [show3DViewer, setShow3DViewer] = useState(false)
  const [selectedQRProduct, setSelectedQRProduct] = useState(null)
  const [showQRModal, setShowQRModal] = useState(false)

  const { products, loading } = useProducts(query ? { search: query } : {})

  // Update local query when URL changes
  useEffect(() => { setLocalQuery(query) }, [query])
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [query])

  const sortedProducts = useMemo(() => {
    let data = [...products]
    if (sortBy === 'price-low') data.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-high') data.sort((a, b) => b.price - a.price)
    else if (sortBy === 'rating') data.sort((a, b) => b.rating - a.rating)
    else if (sortBy === 'discount') {
      data.sort(sortByDiscount)
    }
    return data
  }, [products, sortBy])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!localQuery.trim()) return
    setSearchParams({ q: localQuery.trim() })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24">
      <div className="container mx-auto px-4 py-8">

        {/* Search header */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search for products, brands..."
                className="w-full pl-12 pr-28 py-4 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none shadow-sm transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-sky-600 text-white rounded-xl font-semibold text-sm hover:bg-sky-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {query && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {loading ? 'Searching...' : `Results for "${query}"`}
                </h1>
                {!loading && (
                  <p className="text-slate-500 dark:text-slate-400 mt-1">
                    {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} found
                  </p>
                )}
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
              >
                {sortOptions.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Results */}
        {!query ? (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">Start searching</h2>
            <p className="text-slate-500 dark:text-slate-400">Type a product name, brand, or description above</p>
          </div>
        ) : loading ? (
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
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🔍</p>
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">No results found</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              We couldn't find anything matching "{query}". Try different keywords.
            </p>
            <Link
              to="/"
              className="px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-colors inline-block"
            >
              Back to Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group border border-slate-100 dark:border-slate-700"
              >
                {/* Image */}
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

                  {/* Action buttons at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-1.5 py-1.5 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedQRProduct(product); setShowQRModal(true) }}
                      className="bg-emerald-600 text-white p-2.5 rounded-full hover:bg-emerald-700 transition-all hover:scale-110"
                      title="QR Code"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelected3DProduct(product); setShow3DViewer(true) }}
                      className="bg-purple-600 text-white p-2.5 rounded-full hover:bg-purple-700 transition-all hover:scale-110"
                      title="View in 3D"
                    >
                      <Box className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onTryOn(product) }}
                      className="bg-sky-600 text-white p-2.5 rounded-full hover:bg-sky-700 transition-all hover:scale-110"
                      title="Try with AR"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Badge */}
                  {product.badge && (
                    <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-white ${
                      product.badge === 'New' ? 'bg-emerald-500' :
                      product.badge === 'Sale' ? 'bg-red-500' :
                      product.badge === 'Bestseller' ? 'bg-amber-500' :
                      'bg-purple-500'
                    }`}>
                      {product.badge}
                    </span>
                  )}

                  {/* Wishlist */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleWishlistItem(product) }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 transition-all"
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'text-red-500 fill-red-500' : 'text-slate-600 dark:text-slate-300'}`} />
                  </button>

                  {/* Discount */}
                  {product.originalPrice > product.price && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-500 text-white">
                      {getDiscountPercent(product.price, product.originalPrice)}% OFF
                    </span>
                  )}
                </div>

                {/* Info */}
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

                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs font-semibold text-white bg-emerald-600 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      {product.rating} <Star className="w-2.5 h-2.5 fill-white" />
                    </span>
                    <span className="text-[10px] text-slate-400">({product.reviewCount.toLocaleString()})</span>
                  </div>

                  {/* Price */}
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

                  {/* Add to cart */}
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
                      className="px-3 py-2 rounded-lg border-2 border-sky-500 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors"
                      title="Try with AR"
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

      {/* 3D Viewer */}
      <Product3DViewer
        product={selected3DProduct}
        isOpen={show3DViewer}
        onClose={() => { setShow3DViewer(false); setSelected3DProduct(null) }}
      />

      {/* QR Modal */}
      <QRCodeModal
        product={selectedQRProduct}
        isOpen={showQRModal}
        onClose={() => { setShowQRModal(false); setSelectedQRProduct(null) }}
      />
    </div>
  )
}

export default SearchResults
