import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Star, Heart, ShoppingCart, ShoppingBag, Camera, Box, QrCode,
  ChevronRight, Truck, RotateCcw, Shield, Package, Check, Minus, Plus, Share2,
  MessageSquare, ThumbsUp, User as UserIcon
} from 'lucide-react'
import { useProduct, useProducts } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Product3DViewer from './Product3DViewer'
import QRCodeModal from './QRCodeModal'

const categoryMeta = {
  shoes:   { label: 'Shoes',   slug: 'shoes'   },
  bags:    { label: 'Bags',    slug: 'bags'     },
  clothes: { label: 'Clothes', slug: 'clothes'  },
  watches: { label: 'Watches', slug: 'watches'  },
}

const colorMap = {
  white: '#ffffff', black: '#111111', red: '#ef4444', blue: '#3b82f6',
  gray: '#6b7280', brown: '#92400e', navy: '#1e3a8a', tan: '#d2b48c',
  floral: '#ec4899', silver: '#c0c0c0', gold: '#ffd700', 'rose gold': '#b76e79',
  'light blue': '#93c5fd', green: '#22c55e', yellow: '#eab308', purple: '#a855f7',
}

const StarRating = ({ rating, onRate, interactive = false, size = 'w-5 h-5' }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(star => (
      <button
        key={star}
        type="button"
        disabled={!interactive}
        onClick={() => interactive && onRate?.(star)}
        className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
      >
        <Star className={`${size} ${
          star <= rating
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-slate-300 dark:text-slate-600'
        }`} />
      </button>
    ))}
  </div>
)

const ProductDetail = ({ onTryOn }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, isInWishlist, toggleWishlistItem, isInCart } = useCart()
  const { user, isAuthenticated } = useAuth()

  // Fetch from API (falls back to local data)
  const { product, loading } = useProduct(id)
  const { products: allProducts } = useProducts()

  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [showSizeError, setShowSizeError] = useState(false)
  const [activeTab, setActiveTab] = useState('description')

  // 3D / QR
  const [show3DViewer, setShow3DViewer] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)

  // Reviews
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewMsg, setReviewMsg] = useState(null)

  // Related products
  const relatedProducts = useMemo(() => {
    if (!product) return []
    return allProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4)
  }, [product, allProducts])

  // Fetch reviews
  const fetchReviews = useCallback(async () => {
    if (!product) return
    setReviewsLoading(true)
    try {
      const res = await api.getReviews(product.id)
      setReviews(res.data || [])
    } catch {
      setReviews([])
    } finally {
      setReviewsLoading(false)
    }
  }, [product])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setSelectedColor(0)
    setSelectedSize(null)
    setQuantity(1)
    setShowSizeError(false)
    setReviewRating(5)
    setReviewComment('')
    setReviewMsg(null)
  }, [id])

  // Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated || !product) return
    setReviewSubmitting(true)
    setReviewMsg(null)
    try {
      await api.addReview(product.id, user.name, reviewRating, reviewComment.trim())
      setReviewMsg({ type: 'success', text: 'Review submitted successfully!' })
      setReviewComment('')
      setReviewRating(5)
      fetchReviews()
    } catch (err) {
      setReviewMsg({ type: 'error', text: err.message || 'Failed to submit review' })
    } finally {
      setReviewSubmitting(false)
    }
  }

  // Review stats
  const reviewStats = useMemo(() => {
    if (!reviews.length) return { avg: 0, counts: [0, 0, 0, 0, 0] }
    const counts = [0, 0, 0, 0, 0]
    let sum = 0
    reviews.forEach(r => {
      counts[r.rating - 1]++
      sum += r.rating
    })
    return { avg: (sum / reviews.length).toFixed(1), counts }
  }, [reviews])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-10 animate-pulse">
            <div className="lg:w-1/2 aspect-square bg-slate-200 dark:bg-slate-700 rounded-2xl" />
            <div className="lg:w-1/2 space-y-4">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
              <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
              <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-full" />
              <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">😕</p>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Product not found</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">The product you're looking for doesn't exist.</p>
          <Link to="/" className="px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  const meta = categoryMeta[product.category] || { label: 'Shop', slug: '' }
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  const handleAddToCart = () => {
    if (product.sizes.length > 1 && !selectedSize) {
      setShowSizeError(true)
      return
    }
    setShowSizeError(false)
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
  }

  const handleBuyNow = () => {
    if (product.sizes.length > 1 && !selectedSize) {
      setShowSizeError(true)
      return
    }
    setShowSizeError(false)
    addToCart(product)
    navigate('/checkout')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
        <div className="container mx-auto flex items-center text-sm text-slate-500 dark:text-slate-400 gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/category/${meta.slug}`} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
            {meta.label}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-800 dark:text-white truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 lg:py-6">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">

          {/* ─── Left: Product Image ─── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="sticky top-24">
              {/* Main Image */}
              <div className="relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden aspect-[4/5] lg:aspect-[3/4] max-h-[75vh] shadow-sm border border-slate-100 dark:border-slate-700">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Badge */}
                {product.badge && (
                  <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-bold text-white ${
                    product.badge === 'Sale' ? 'bg-red-500' :
                    product.badge === 'New' ? 'bg-emerald-500' :
                    product.badge === 'Bestseller' ? 'bg-amber-500' :
                    product.badge === 'Trending' ? 'bg-purple-500' : 'bg-sky-500'
                  }`}>
                    {product.badge}
                  </div>
                )}

                {/* Discount */}
                {discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                    -{discount}% OFF
                  </div>
                )}

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlistItem(product)}
                  className="absolute bottom-4 right-4 p-3 rounded-full bg-white/90 dark:bg-slate-700/90 shadow-lg hover:scale-110 transition-all"
                >
                  <Heart className={`w-5 h-5 ${
                    isInWishlist(product.id)
                      ? 'text-red-500 fill-red-500'
                      : 'text-slate-500 dark:text-slate-300'
                  }`} />
                </button>
              </div>

              {/* Quick action buttons below image */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => onTryOn(product)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold text-sm hover:from-sky-600 hover:to-sky-700 transition-all shadow-md"
                >
                  <Camera className="w-4 h-4" />
                  AR Try-On
                </button>
                <button
                  onClick={() => setShow3DViewer(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold text-sm hover:from-purple-600 hover:to-purple-700 transition-all shadow-md"
                >
                  <Box className="w-4 h-4" />
                  3D View
                </button>
                <button
                  onClick={() => setShowQRModal(true)}
                  className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  title="QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* ─── Right: Product Info ─── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-5"
          >
            {/* Brand */}
            <div>
              <Link
                to={`/category/${meta.slug}`}
                className="text-sm font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider hover:underline"
              >
                {product.brand}
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                {product.name}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">{product.description}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1 bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-sm font-bold">
                {product.rating}
                <Star className="w-3.5 h-3.5 fill-white" />
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : i < product.rating
                        ? 'text-yellow-400 fill-yellow-400 opacity-50'
                        : 'text-slate-300 dark:text-slate-600'
                  }`} />
                ))}
              </div>
              <button
                onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
              >
                {reviews.length > 0 ? `${reviews.length} Reviews` : `${product.reviewCount.toLocaleString()} Ratings`}
              </button>
            </div>

            {/* Price */}
            <div className="pb-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-slate-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-lg font-semibold text-orange-500">
                      ({discount}% OFF)
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mt-1">inclusive of all taxes</p>
            </div>

            {/* Colors */}
            <div className="pb-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-3">
                Color: <span className="font-normal text-slate-500 dark:text-slate-400 normal-case">{product.colors[selectedColor]}</span>
              </h3>
              <div className="flex gap-3">
                {product.colors.map((color, i) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(i)}
                    className={`relative w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                      selectedColor === i
                        ? 'border-sky-500 ring-2 ring-sky-200 dark:ring-sky-800 scale-110'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                    style={{ backgroundColor: colorMap[color.toLowerCase()] || '#9ca3af' }}
                    title={color}
                  >
                    {selectedColor === i && (
                      <Check className={`w-4 h-4 absolute inset-0 m-auto ${
                        ['white', 'silver', 'gold', 'tan', 'light blue', 'yellow'].includes(color.toLowerCase())
                          ? 'text-slate-800'
                          : 'text-white'
                      }`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="pb-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                  Select Size
                </h3>
                {product.category === 'shoes' || product.category === 'clothes' ? (
                  <button className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline uppercase">
                    Size Guide
                  </button>
                ) : null}
              </div>
              {showSizeError && (
                <p className="text-red-500 text-xs font-medium mb-2">Please select a size</p>
              )}
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setShowSizeError(false) }}
                    className={`min-w-[52px] px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                      selectedSize === size
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300'
                        : 'border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-sky-300 dark:hover:border-sky-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="pb-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-3">
                Quantity
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-600 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Minus className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </button>
                <span className="w-12 text-center text-lg font-bold text-slate-900 dark:text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(10, q + 1))}
                  className="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-600 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Plus className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </button>
              </div>
            </div>

            {/* Add to Cart / Buy Now */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                  isInCart(product.id)
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-700'
                    : 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 border-2 border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {isInCart(product.id) ? 'Added to Cart' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-sky-600 text-white hover:bg-sky-700 transition-all shadow-lg"
              >
                <ShoppingBag className="w-5 h-5" />
                Buy Now
              </button>
            </div>

            {/* Delivery & policy info */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 space-y-3">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-slate-500 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">Free Delivery</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">On orders above ₹999</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-slate-500 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">30-Day Returns</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Free return & exchange</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-slate-500 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">Secure Payment</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">100% secure checkout</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-slate-500 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">In Stock</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Ships within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Product Details tabs */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="flex border-b border-slate-200 dark:border-slate-700">
                {['description', 'details', 'shipping'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${
                      activeTab === tab
                        ? 'text-sky-600 dark:text-sky-400 border-b-2 border-sky-600 dark:border-sky-400'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="p-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeTab === 'description' && (
                  <div>
                    <p>{product.description}</p>
                    <ul className="mt-3 space-y-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500" />
                        Premium quality materials
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500" />
                        AR Virtual Try-On enabled
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500" />
                        Designed for comfort and style
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500" />
                        100% authentic product
                      </li>
                    </ul>
                  </div>
                )}
                {activeTab === 'details' && (
                  <table className="w-full">
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      <tr>
                        <td className="py-2.5 text-slate-500 dark:text-slate-400 w-1/3">Brand</td>
                        <td className="py-2.5 font-medium text-slate-800 dark:text-white">{product.brand}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 text-slate-500 dark:text-slate-400">Category</td>
                        <td className="py-2.5 font-medium text-slate-800 dark:text-white capitalize">{product.category}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 text-slate-500 dark:text-slate-400">Colors</td>
                        <td className="py-2.5 font-medium text-slate-800 dark:text-white">{product.colors.join(', ')}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 text-slate-500 dark:text-slate-400">Sizes</td>
                        <td className="py-2.5 font-medium text-slate-800 dark:text-white">{product.sizes.join(', ')}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 text-slate-500 dark:text-slate-400">Availability</td>
                        <td className="py-2.5 font-medium text-emerald-600 dark:text-emerald-400">
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 text-slate-500 dark:text-slate-400">SKU</td>
                        <td className="py-2.5 font-medium text-slate-800 dark:text-white">ARV-{product.category.toUpperCase()}-{String(product.id).padStart(4, '0')}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
                {activeTab === 'shipping' && (
                  <div className="space-y-3">
                    <p><strong>Delivery:</strong> Free on orders above Rs. 4,150. Standard delivery in 3-5 business days.</p>
                    <p><strong>Express:</strong> 1-2 business days. Rs. 249 extra.</p>
                    <p><strong>Returns:</strong> 30-day hassle-free returns. Items must be unworn with tags attached.</p>
                    <p><strong>Exchange:</strong> Free exchange within 30 days for a different size or color.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── Reviews Section ─── */}
        <div className="mt-14" id="reviews">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-sky-600" />
              Ratings & Reviews
            </h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Summary */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
              <div className="text-center mb-5">
                <div className="text-5xl font-bold text-slate-900 dark:text-white">
                  {reviews.length ? reviewStats.avg : product.rating}
                </div>
                <StarRating rating={Math.round(reviews.length ? reviewStats.avg : product.rating)} size="w-5 h-5" />
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {reviews.length ? `Based on ${reviews.length} review${reviews.length !== 1 ? 's' : ''}` : `${product.reviewCount.toLocaleString()} ratings`}
                </p>
              </div>

              {/* Star bars */}
              {reviews.length > 0 && (
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = reviewStats.counts[star - 1]
                    const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0
                    return (
                      <div key={star} className="flex items-center gap-2 text-sm">
                        <span className="w-3 text-slate-600 dark:text-slate-400 font-medium">{star}</span>
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-xs text-slate-500 dark:text-slate-400">{count}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Right: Write review + Review list */}
            <div className="lg:col-span-2 space-y-5">
              {/* Write a Review */}
              {isAuthenticated ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5"
                >
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wide mb-4">Write a Review</h3>

                  {reviewMsg && (
                    <div className={`mb-4 p-3 rounded-xl text-sm flex items-center gap-2 ${
                      reviewMsg.type === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                        : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                    }`}>
                      {reviewMsg.text}
                    </div>
                  )}

                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Your Rating</label>
                      <StarRating rating={reviewRating} onRate={setReviewRating} interactive size="w-7 h-7" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Your Review (optional)</label>
                      <textarea
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        placeholder="Share your experience with this product..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-semibold rounded-xl text-sm transition-colors"
                    >
                      {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    <Link to="/login" className="text-sky-600 dark:text-sky-400 font-semibold hover:underline">Sign in</Link> to write a review
                  </p>
                </div>
              )}

              {/* Reviews List */}
              {reviewsLoading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 animate-pulse">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24" />
                          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-16" />
                        </div>
                      </div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                    </div>
                  ))}
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review, idx) => (
                    <motion.div
                      key={review._id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700"
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {review.userName?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || <UserIcon className="w-4 h-4" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold text-slate-800 dark:text-white">{review.userName}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <StarRating rating={review.rating} size="w-3.5 h-3.5" />
                                {review.verified && (
                                  <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                                    <Check className="w-3 h-3" /> Verified
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
                              {new Date(review.date || review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>

                          {review.comment && (
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                              {review.comment}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-8 text-center">
                  <MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No reviews yet</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Be the first to review this product!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── Related Products ─── */}
        {relatedProducts.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Similar Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/product/${rp.id}`}
                  className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group border border-slate-100 dark:border-slate-700"
                >
                  <div className="relative aspect-[3/4] bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <img
                      src={rp.image}
                      alt={rp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-white/95 dark:bg-slate-800/95 px-2 py-1 rounded text-xs font-bold shadow">
                      <span className="text-slate-800 dark:text-white">{rp.rating}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-slate-400 font-normal">|</span>
                      <span className="text-slate-500 font-normal">
                        {rp.reviewCount >= 1000 ? `${(rp.reviewCount / 1000).toFixed(1)}k` : rp.reviewCount}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-bold text-slate-800 dark:text-white uppercase truncate">{rp.brand}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">{rp.name}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        ₹{rp.price.toLocaleString('en-IN')}
                      </span>
                      {rp.originalPrice > rp.price && (
                        <span className="text-xs font-semibold text-orange-500">
                          ({Math.round(((rp.originalPrice - rp.price) / rp.originalPrice) * 100)}% OFF)
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3D Viewer */}
      <Product3DViewer
        product={product}
        isOpen={show3DViewer}
        onClose={() => setShow3DViewer(false)}
      />

      {/* QR Modal */}
      <QRCodeModal
        product={product}
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
      />
    </div>
  )
}

export default ProductDetail
