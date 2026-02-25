import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Trash2, ChevronLeft, Star, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'

const WishlistPage = () => {
  const {
    wishlistItems,
    removeFromWishlist,
    moveToCartFromWishlist,
    isInCart,
  } = useCart()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 px-4 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 mb-6 text-sm font-medium transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Store
        </Link>

        {/* Title */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Heart className="w-7 h-7 text-pink-500 fill-pink-500" />
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              My Wishlist
            </h1>
            {wishlistItems.length > 0 && (
              <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 text-sm font-bold px-3 py-1 rounded-full">
                {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 py-20 text-center"
          >
            <Heart className="w-20 h-20 text-slate-200 dark:text-slate-700 mx-auto mb-5" />
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
              Browse our collection and tap the heart icon to save items you love!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Explore Products
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {wishlistItems.map((item, idx) => {
              const alreadyInCart = isInCart(item.id)
              const discount =
                item.originalPrice > item.price
                  ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                  : 0

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-slate-100 dark:border-slate-700 group relative flex flex-col"
                >
                  {/* Remove button */}
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 dark:bg-slate-700/90 shadow-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>

                  {/* Discount badge */}
                  {discount > 0 && (
                    <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                      -{discount}%
                    </div>
                  )}

                  {/* Image */}
                  <Link to={`/product/${item.id}`} className="block">
                    <div className="relative aspect-[3/4] bg-slate-100 dark:bg-slate-700 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {/* Rating badge */}
                      {item.rating && (
                        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-white/95 dark:bg-slate-800/95 px-2 py-1 rounded text-xs font-bold shadow">
                          <span className="text-slate-800 dark:text-white">{item.rating}</span>
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          {item.reviewCount != null && (
                            <>
                              <span className="text-slate-400 font-normal">|</span>
                              <span className="text-slate-500 font-normal">
                                {item.reviewCount >= 1000
                                  ? `${(item.reviewCount / 1000).toFixed(1)}k`
                                  : item.reviewCount}
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-3 flex-1 flex flex-col">
                    <Link to={`/product/${item.id}`} className="block">
                      <p className="text-xs font-bold text-slate-800 dark:text-white uppercase truncate">
                        {item.brand}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {item.name}
                      </p>
                    </Link>

                    {/* Price */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      {item.originalPrice > item.price && (
                        <>
                          <span className="text-xs text-slate-400 line-through">
                            ₹{item.originalPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs font-semibold text-orange-500">
                            ({discount}% OFF)
                          </span>
                        </>
                      )}
                    </div>

                    {/* Move to Cart */}
                    <button
                      onClick={() => moveToCartFromWishlist(item)}
                      disabled={alreadyInCart}
                      className={`mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        alreadyInCart
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 cursor-default'
                          : 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 border-2 border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {alreadyInCart ? 'Already in Cart' : 'Move to Cart'}
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default WishlistPage
