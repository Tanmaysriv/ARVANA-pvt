import { X, Plus, Minus, Trash2, ShoppingBag, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal, 
    isCartOpen, 
    toggleCart 
  } = useCart()
  const navigate = useNavigate()

  if (!isCartOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={toggleCart}
        />

        {/* Cart Sidebar */}
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
              <ShoppingBag className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-2xl font-bold dark:text-white">Shopping Cart</h2>
              <span className="bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 text-sm font-bold px-2 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            </div>
            <button
              onClick={toggleCart}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <X className="w-6 h-6 dark:text-slate-300" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-24 h-24 text-gray-300 dark:text-slate-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-300 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 dark:text-slate-400 mb-6">Browse our collection and add items you love!</p>
                <button 
                  onClick={toggleCart}
                  className="btn-primary"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className="flex items-center space-x-4 bg-gray-50 dark:bg-slate-700 p-4 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-slate-400">{item.brand}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                          ₹{item.price.toLocaleString('en-IN')}
                        </p>
                        {item.originalPrice > item.price && (
                          <p className="text-sm text-gray-400 line-through">
                            ₹{item.originalPrice.toLocaleString('en-IN')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-2 bg-white dark:bg-slate-600 rounded-lg border dark:border-slate-500">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-slate-500 rounded-l-lg transition-colors"
                        >
                          <Minus className="w-4 h-4 dark:text-slate-300" />
                        </button>
                        <span className="px-3 font-semibold dark:text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-slate-500 rounded-r-lg transition-colors"
                        >
                          <Plus className="w-4 h-4 dark:text-slate-300" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t dark:border-slate-700 p-6 space-y-4">
              {/* Shipping info */}
              <div className="text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg text-center font-medium">
                {getCartTotal() >= 4000 
                  ? '🎉 You qualify for FREE shipping!'
                  : `Add ₹${(4000 - getCartTotal()).toLocaleString('en-IN')} more for free shipping`
                }
              </div>

              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold dark:text-slate-300">Subtotal:</span>
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  ₹{getCartTotal().toLocaleString('en-IN')}
                </span>
              </div>
              <button
                onClick={() => { toggleCart(); navigate('/checkout') }}
                className="w-full btn-primary py-4 text-lg"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={clearCart}
                className="w-full btn-secondary py-3"
              >
                Clear Cart
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default Cart
