import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Heart, Box, QrCode, ShoppingCart, Star, ShoppingBag, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { useProducts, useCategories } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import Product3DViewer from './Product3DViewer'
import QRCodeModal from './QRCodeModal'
import { getDiscountPercent, sortByDiscount } from '../utils/price'

const ProductCatalog = ({ onTryOn }) => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selected3DProduct, setSelected3DProduct] = useState(null)
  const [show3DViewer, setShow3DViewer] = useState(false)
  const [selectedQRProduct, setSelectedQRProduct] = useState(null)
  const [showQRModal, setShowQRModal] = useState(false)
  const [sortBy, setSortBy] = useState('default')

  const { addToCart, isInWishlist, toggleWishlistItem, isInCart } = useCart()

  // Fetch from API (falls back to local data if backend is down)
  const { products, loading } = useProducts()
  const { categories } = useCategories()

  const handle3DView = (product) => {
    setSelected3DProduct(product)
    setShow3DViewer(true)
  }

  const handleQRCode = (product) => {
    setSelectedQRProduct(product)
    setShowQRModal(true)
  }

  const filteredProducts = useMemo(() => {
    let data = selectedCategory === 'all'
      ? [...products]
      : products.filter(p => p.category === selectedCategory)

    // Sorting
    if (sortBy === 'price-low') {
      data.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      data.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating') {
      data.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'discount') {
      data.sort(sortByDiscount)
    }
    return data
  }, [products, selectedCategory, sortBy])

  return (
    <section className="py-14 px-4 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Shop Our Collection
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Find your perfect style — try before you buy with AR
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Sort & Count Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
          >
            <option value="default">Sort by: Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-[4/5] bg-slate-200 dark:bg-slate-700 rounded-t-2xl" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                  <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="card group"
            >
              {/* Product Image */}
              <div
                className="relative overflow-hidden aspect-square cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Action buttons – small strip at bottom, no overlay blocking the image */}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-1.5 py-1.5 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleQRCode(product) }}
                    className="pointer-events-auto bg-emerald-600 text-white p-1.5 sm:p-2 rounded-full hover:bg-emerald-700 transition-all hover:scale-110"
                    title="QR Code for Mobile"
                  >
                    <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handle3DView(product) }}
                    className="pointer-events-auto bg-purple-600 text-white p-1.5 sm:p-2 rounded-full hover:bg-purple-700 transition-all hover:scale-110"
                    title="View in 3D"
                  >
                    <Box className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onTryOn(product) }}
                    className="pointer-events-auto bg-sky-600 text-white p-1.5 sm:p-2 rounded-full hover:bg-sky-700 transition-all hover:scale-110"
                    title="Try with AR"
                  >
                    <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>

                {/* Wishlist Heart */}
                <button
                  onClick={() => toggleWishlistItem(product)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-md hover:scale-110 transition-all z-10"
                  title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-5 h-5 transition-colors ${
                    isInWishlist(product.id) 
                      ? 'text-red-500 fill-red-500' 
                      : 'text-gray-500 dark:text-slate-300'
                  }`} />
                </button>

                {/* Badge */}
                {product.badge && (
                  <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white ${
                    product.badge === 'Sale' ? 'bg-red-500' :
                    product.badge === 'New' ? 'bg-emerald-500' :
                    product.badge === 'Bestseller' ? 'bg-amber-500' :
                    product.badge === 'Trending' ? 'bg-purple-500' :
                    'bg-sky-500'
                  }`}>
                    {product.badge}
                  </div>
                )}

                {/* Discount Badge */}
                {product.originalPrice > product.price && (
                  <div className="absolute bottom-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                    -{getDiscountPercent(product.price, product.originalPrice)}%
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                {/* Brand */}
                <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
                  {product.brand}
                </p>

                <h3
                  className="font-bold text-lg mb-1 line-clamp-1 dark:text-white cursor-pointer hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {product.name}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-2 line-clamp-2">{product.description}</p>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${
                        i < Math.floor(product.rating) 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-slate-300 dark:text-slate-600'
                      }`} />
                    ))}
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400 ml-1">
                    {product.rating} ({product.reviewCount.toLocaleString()})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-slate-400 dark:text-slate-500 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                {/* Colors */}
                <div className="flex gap-2 mb-4">
                  {product.colors.slice(0, 3).map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 cursor-pointer hover:scale-110 transition-transform"
                      style={{ 
                        backgroundColor: color.toLowerCase() === 'white' ? '#fff' : 
                                       color.toLowerCase() === 'black' ? '#000' :
                                       color.toLowerCase() === 'red' ? '#ef4444' :
                                       color.toLowerCase() === 'blue' ? '#3b82f6' :
                                       color.toLowerCase() === 'gray' ? '#6b7280' :
                                       color.toLowerCase() === 'brown' ? '#92400e' :
                                       color.toLowerCase() === 'navy' ? '#1e3a8a' :
                                       color.toLowerCase() === 'tan' ? '#d2b48c' :
                                       color.toLowerCase() === 'floral' ? '#ec4899' :
                                       color.toLowerCase() === 'silver' ? '#c0c0c0' :
                                       color.toLowerCase() === 'gold' ? '#ffd700' :
                                       color.toLowerCase() === 'rose gold' ? '#b76e79' :
                                       color.toLowerCase() === 'light blue' ? '#93c5fd' :
                                       '#9ca3af'
                      }}
                      title={color}
                    />
                  ))}
                  {product.colors.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-slate-400 self-center">+{product.colors.length - 3}</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(product)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-semibold transition-all duration-300 text-sm ${
                      isInCart(product.id)
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-700'
                        : 'btn-primary'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{isInCart(product.id) ? 'Added' : 'Add to Cart'}</span>
                  </button>
                  <button
                    onClick={() => onTryOn(product)}
                    className="px-4 py-3 rounded-xl font-semibold transition-all duration-300 text-sm border-2 border-sky-500 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20"
                    title="Try On with AR"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* Buy Now */}
                <button
                  onClick={() => { addToCart(product); navigate('/checkout') }}
                  className="w-full mt-2 py-3 rounded-xl font-semibold text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>
      
      {/* 3D Product Viewer */}
      <Product3DViewer
        product={selected3DProduct}
        isOpen={show3DViewer}
        onClose={() => setShow3DViewer(false)}
      />

      {/* QR Code Modal */}
      <QRCodeModal
        product={selectedQRProduct}
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
      />
    </section>
  )
}

export default ProductCatalog
