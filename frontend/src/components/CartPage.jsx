import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, ShoppingCart, Trash2, Minus, Plus, ChevronLeft, Star, Truck, Shield, RotateCcw } from 'lucide-react'
import { useCart } from '../context/CartContext'

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  } = useCart()
  const navigate = useNavigate()

  const subtotal = getCartTotal()
  const shipping = subtotal >= 999 ? 0 : 99
  const total = subtotal + shipping
  const savings = cartItems.reduce((sum, item) => {
    const disc = item.originalPrice > item.price ? (item.originalPrice - item.price) * item.quantity : 0
    return sum + disc
  }, 0)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 px-4 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 mb-6 text-sm font-medium transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        {/* Title */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 text-sky-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              Shopping Cart
            </h1>
            {cartItems.length > 0 && (
              <span className="bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 text-sm font-bold px-3 py-1 rounded-full">
                {getCartCount()} item{getCartCount() !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Empty State */}
        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 py-20 text-center"
          >
            <ShoppingBag className="w-20 h-20 text-slate-200 dark:text-slate-700 mx-auto mb-5" />
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">
              Your cart is empty
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
              Looks like you haven't added anything to your cart yet. Start shopping!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, idx) => {
                const discount =
                  item.originalPrice > item.price
                    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                    : 0

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 flex gap-4 group"
                  >
                    {/* Image */}
                    <Link to={`/product/${item.id}`} className="flex-shrink-0">
                      <div className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {discount > 0 && (
                          <span className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            -{discount}%
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link to={`/product/${item.id}`}>
                            <p className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase">
                              {item.brand}
                            </p>
                            <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white truncate mt-0.5">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-xs text-slate-400 dark:text-slate-500 capitalize mt-0.5">
                            {item.category}
                          </p>
                          {/* Rating */}
                          {item.rating && (
                            <div className="flex items-center gap-1 mt-1">
                              <div className="flex items-center gap-0.5 bg-emerald-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                                {item.rating}
                                <Star className="w-2.5 h-2.5 fill-white" />
                              </div>
                              <span className="text-[10px] text-slate-400">
                                ({item.reviewCount?.toLocaleString()})
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price + Quantity */}
                      <div className="mt-auto pt-2 flex items-end justify-between">
                        <div>
                          <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-xs text-slate-400 ml-1">
                              (₹{item.price.toLocaleString('en-IN')} each)
                            </span>
                          )}
                          {discount > 0 && (
                            <p className="text-xs text-orange-500 font-medium">
                              You save ₹{((item.originalPrice - item.price) * item.quantity).toLocaleString('en-IN')}
                            </p>
                          )}
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                          </button>
                          <span className="w-10 text-center text-sm font-bold text-slate-900 dark:text-white border-x border-slate-300 dark:border-slate-600 h-9 flex items-center justify-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, Math.min(10, item.quantity + 1))}
                            className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6"
                >
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5">
                    Order Summary
                  </h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Subtotal ({getCartCount()} items)</span>
                      <span className="font-medium text-slate-800 dark:text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Shipping</span>
                      <span className={`font-medium ${shipping === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-white'}`}>
                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                      </span>
                    </div>
                    {savings > 0 && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                        <span>Total Savings</span>
                        <span className="font-medium">-₹{savings.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between">
                      <span className="text-base font-bold text-slate-900 dark:text-white">Total</span>
                      <span className="text-xl font-bold text-slate-900 dark:text-white">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full mt-5 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-sky-600/20"
                  >
                    Proceed to Checkout
                  </button>

                  {subtotal < 999 && (
                    <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-3">
                      Add ₹{(999 - subtotal).toLocaleString('en-IN')} more for free shipping
                    </p>
                  )}
                </motion.div>

                {/* Trust badges */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 space-y-3"
                >
                  <div className="flex items-center gap-3 text-sm">
                    <Truck className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400">Free delivery on orders above ₹999</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <RotateCcw className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400">30-day hassle-free returns</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400">100% secure checkout</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage
