import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'

const Wishlist = () => {
  const {
    wishlistItems,
    removeFromWishlist,
    moveToCartFromWishlist,
    getWishlistCount,
    isWishlistOpen,
    toggleWishlist,
    isInCart,
  } = useCart()

  if (!isWishlistOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={toggleWishlist}
        />

        {/* Wishlist Sidebar */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-800 shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b dark:border-slate-700">
            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-pink-500" fill="currentColor" />
              <h2 className="text-2xl font-bold dark:text-white">Wishlist</h2>
              <span className="bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 text-sm font-bold px-2 py-0.5 rounded-full">
                {getWishlistCount()}
              </span>
            </div>
            <button
              onClick={toggleWishlist}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <X className="w-6 h-6 dark:text-slate-300" />
            </button>
          </div>

          {/* Wishlist Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {wishlistItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Heart className="w-24 h-24 text-gray-300 dark:text-slate-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-300 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-500 dark:text-slate-400 mb-6">Save your favorite items and come back to them later!</p>
                <button
                  onClick={toggleWishlist}
                  className="btn-primary"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlistItems.map((item) => {
                  const alreadyInCart = isInCart(item.id)
                  const discount = item.originalPrice > item.price
                    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                    : 0

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="flex items-start space-x-4 bg-gray-50 dark:bg-slate-700 p-4 rounded-lg relative"
                    >
                      {/* Product Image */}
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        {discount > 0 && (
                          <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                            -{discount}%
                          </span>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">{item.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400">{item.brand}</p>
                        <p className="text-xs text-gray-400 dark:text-slate-500 capitalize">{item.category}</p>

                        {/* Prices */}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                            ₹{item.price.toLocaleString('en-IN')}
                          </span>
                          {item.originalPrice > item.price && (
                            <span className="text-sm text-gray-400 line-through">
                              ₹{item.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>

                        {/* Rating */}
                        {item.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-3 h-3 ${i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-slate-500'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-slate-400">
                              ({item.reviewCount})
                            </span>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => moveToCartFromWishlist(item)}
                            disabled={alreadyInCart}
                            className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                              alreadyInCart
                                ? 'bg-gray-200 dark:bg-slate-600 text-gray-500 dark:text-slate-400 cursor-not-allowed'
                                : 'bg-primary-600 text-white hover:bg-primary-700'
                            }`}
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            {alreadyInCart ? 'In Cart' : 'Move to Cart'}
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Remove from Wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {wishlistItems.length > 0 && (
            <div className="border-t dark:border-slate-700 p-6 space-y-3">
              <p className="text-sm text-gray-500 dark:text-slate-400 text-center">
                {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
              </p>
              <button
                onClick={toggleWishlist}
                className="w-full btn-secondary py-3"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default Wishlist
