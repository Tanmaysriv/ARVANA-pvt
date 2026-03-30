import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, MapPin, CreditCard, Truck, ShieldCheck, CheckCircle2, MessageCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const WHATSAPP_NUMBER = '919506720216'

// ═══ PAYMENT CONFIGURATION ═══
const PAYMENT_CONFIG = {
  upiId: 'tamarshss2003-1@okicici',  // Your UPI ID
  qrCodeUrl: '/payment-qr.jpg',  // QR code in public folder
  bankName: 'ICICI Bank',
  accountName: 'Tamarsh Shekhar Singh',
}


const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()

  const [step, setStep] = useState(1) // 1=address, 2=payment, 3=confirm
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(null)

  // Address form — pre-fill from saved profile address
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    country: user?.address?.country || 'India',
  })

  const [paymentMethod, setPaymentMethod] = useState('cod')

  const subtotal = getCartTotal()
  const shipping = subtotal >= 999 ? 0 : 99
  const total = subtotal + shipping

  // Redirect if not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 px-4">
        <div className="max-w-md mx-auto text-center py-20">
          <ShieldCheck className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Login Required</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Please sign in to proceed with checkout.</p>
          <Link
            to="/login"
            state={{ from: '/checkout' }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors"
          >
            Sign In to Continue
          </Link>
        </div>
      </div>
    )
  }

  // Redirect if cart is empty (and no order just placed)
  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 px-4">
        <div className="max-w-md mx-auto text-center py-20">
          <Truck className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Your Cart is Empty</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Add some items to your cart first.</p>
          <Link to="/#catalog" className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  const handleAddressChange = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const validateAddress = () => {
    const required = ['fullName', 'phone', 'street', 'city', 'state', 'pincode']
    for (const f of required) {
      if (!address[f]?.trim()) {
        setError(`Please fill in ${f === 'fullName' ? 'full name' : f === 'pincode' ? 'PIN code' : f}`)
        return false
      }
    }
    if (!/^\d{6}$/.test(address.pincode.trim())) {
      setError('PIN code must be 6 digits')
      return false
    }
    if (!/^\d{10}$/.test(address.phone.replace(/\s/g, ''))) {
      setError('Phone number must be 10 digits')
      return false
    }
    return true
  }

  const handlePlaceOrder = async () => {
    setError('')
    setLoading(true)

    try {
      const orderItems = cartItems.map(item => ({
        productId: String(item.id),
        name: item.name,
        brand: item.brand || '',
        price: item.price,
        originalPrice: item.originalPrice || item.price,
        image: item.image,
        category: item.category || '',
        quantity: item.quantity,
      }))

      const res = await api.placeOrder({
        items: orderItems,
        shippingAddress: {
          fullName: address.fullName.trim(),
          phone: address.phone.trim(),
          street: address.street.trim(),
          city: address.city.trim(),
          state: address.state.trim(),
          pincode: address.pincode.trim(),
          country: 'India',
        },
        paymentMethod,
      })

      if (res.success) {
        setOrderPlaced(res.data)
        clearCart()
        setStep(3)

        // If WhatsApp payment selected, open WhatsApp with detailed payment instructions
        if (paymentMethod === 'whatsapp') {
          const itemsList = cartItems.map(item => `• ${item.name} x${item.quantity} — Rs.${(item.price * item.quantity).toLocaleString('en-IN')}`).join('\n')
          
          const msg = `*ARVANA Order #${res.data.orderNumber}*\n\n` +
            `${itemsList}\n\n` +
            `*Order Summary:*\n` +
            `Subtotal: Rs.${subtotal.toLocaleString('en-IN')}\n` +
            `Shipping: ${shipping === 0 ? 'FREE' : `Rs.${shipping}`}\n` +
            `-------------------------\n` +
            `*Total: Rs.${res.data.total.toLocaleString('en-IN')}*\n\n` +
            `*Delivery Address:*\n` +
            `${address.fullName}\n` +
            `${address.street}\n` +
            `${address.city}, ${address.state} - ${address.pincode}\n` +
            `Phone: ${address.phone}\n\n` +
            `-------------------------\n\n` +
            `*PAYMENT OPTIONS:*\n\n` +
            `*Option 1: UPI Payment (Recommended)*\n` +
            `UPI ID: ${PAYMENT_CONFIG.upiId}\n` +
            `Copy the UPI ID and pay via any UPI app\n\n` +
            `*Option 2: Scan QR Code*\n` +
            `View QR: ${window.location.origin}/payment-qr.jpg\n` +
            `Scan & pay using Google Pay, PhonePe, Paytm\n\n` +
            `*Option 3: Bank Transfer*\n` +
            `Bank: ${PAYMENT_CONFIG.bankName}\n` +
            `Name: ${PAYMENT_CONFIG.accountName}\n\n` +
            `-------------------------\n\n` +
            `*After Payment:*\n` +
            `1. Take a screenshot of payment\n` +
            `2. Send it to this number\n` +
            `3. We'll confirm your order immediately!\n\n` +
            `*Delivery:* 3-5 business days\n` +
            `*Support:* Reply to this message for any queries\n\n` +
            `Thank you for shopping with ARVANA!`
          
          const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
          // Small delay so user sees the confirmation screen first
          setTimeout(() => window.open(waUrl, '_blank'), 1200)
        }
      } else {
        setError(res.error || 'Failed to place order')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // ─── ORDER CONFIRMATION ───
  if (step === 3 && orderPlaced) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto text-center py-12"
        >
          <div className={`w-20 h-20 ${orderPlaced.paymentMethod === 'whatsapp' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'} rounded-full flex items-center justify-center mx-auto mb-6`}>
            <CheckCircle2 className={`w-10 h-10 ${orderPlaced.paymentMethod === 'whatsapp' ? 'text-amber-600' : 'text-emerald-600'}`} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            {orderPlaced.paymentMethod === 'whatsapp' ? 'Order Placed!' : 'Order Confirmed!'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-1">
            Order Number: <span className="font-semibold text-sky-600">{orderPlaced.orderNumber}</span>
          </p>
          {orderPlaced.paymentMethod === 'whatsapp' && (
            <p className="text-amber-600 dark:text-amber-400 font-semibold text-sm mb-2">
              ⏳ Awaiting Payment Confirmation
            </p>
          )}
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Estimated delivery by{' '}
            <span className="font-semibold">
              {new Date(orderPlaced.estimatedDelivery).toLocaleDateString('en-IN', {
                weekday: 'long', day: 'numeric', month: 'long',
              })}
            </span>
          </p>

          {orderPlaced.paymentMethod === 'whatsapp' && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700 rounded-2xl p-6 mb-6 text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <h4 className="font-bold text-green-900 dark:text-green-100 text-base">WhatsApp Payment</h4>
                  <p className="text-xs text-green-700 dark:text-green-400">Complete payment to confirm your order</p>
                </div>
              </div>
              
              <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4 mb-4">
                <p className="text-sm font-semibold text-slate-800 dark:text-white mb-3">📱 Payment Methods:</p>
                <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-green-600">1.</span>
                    <div>
                      <p className="font-semibold">UPI Payment (Fastest)</p>
                      <p className="text-slate-600 dark:text-slate-400">UPI ID: <span className="font-mono font-bold text-green-700 dark:text-green-400">{PAYMENT_CONFIG.upiId}</span></p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-green-600">2.</span>
                    <div>
                      <p className="font-semibold">Scan QR Code</p>
                      <p className="text-slate-600 dark:text-slate-400">Use any UPI app to scan and pay</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-green-600">3.</span>
                    <div>
                      <p className="font-semibold">Bank Transfer</p>
                      <p className="text-slate-600 dark:text-slate-400">{PAYMENT_CONFIG.bankName}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg p-3 mb-4">
                <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1">⚡ Next Steps:</p>
                <ol className="text-xs text-amber-800 dark:text-amber-300 space-y-1 ml-4 list-decimal">
                  <li>Open the WhatsApp chat (auto-opened)</li>
                  <li>Choose your payment method from the message</li>
                  <li>Complete payment</li>
                  <li>Send payment screenshot to confirm</li>
                </ol>
              </div>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi, I placed order #${orderPlaced.orderNumber}. Total: ₹${orderPlaced.total.toLocaleString('en-IN')}. Please share payment details.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Open WhatsApp Again
              </a>
            </div>
          )}

          {orderPlaced.paymentMethod === 'cod' && (
            <div className="bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-2xl p-6 mb-6 text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 dark:text-blue-100 text-base">Cash on Delivery</h4>
                  <p className="text-xs text-blue-700 dark:text-blue-400">Pay when your order arrives</p>
                </div>
              </div>
              
              <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4 mb-4">
                <p className="text-sm font-semibold text-slate-800 dark:text-white mb-3">💵 Payment Details:</p>
                <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">✓</span>
                    <p>No advance payment required</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">✓</span>
                    <p>Pay <span className="font-bold text-blue-700 dark:text-blue-400">₹{orderPlaced.total.toLocaleString('en-IN')}</span> to delivery person</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">✓</span>
                    <p>Cash or UPI payment accepted at delivery</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">✓</span>
                    <p>Please keep exact amount or UPI ready</p>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded-lg p-3">
                <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 mb-1">📦 What's Next:</p>
                <ol className="text-xs text-emerald-800 dark:text-emerald-300 space-y-1 ml-4 list-decimal">
                  <li>Your order is being prepared</li>
                  <li>We'll notify you when it ships</li>
                  <li>Delivery in 3-5 business days</li>
                  <li>Pay cash/UPI to delivery person</li>
                </ol>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 text-left mb-8">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Order Summary</h3>
            {orderPlaced.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{item.name}</p>
                  <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>₹{orderPlaced.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Shipping</span>
                <span>{orderPlaced.shipping === 0 ? 'FREE' : `₹${orderPlaced.shipping}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-800 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Total</span>
                <span>₹{orderPlaced.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/orders"
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors"
            >
              View My Orders
            </Link>
            <Link
              to="/"
              className="px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  // ─── CHECKOUT FORM ───
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 px-4 pb-20">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 mb-6 text-sm font-medium transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 mb-10">
          {[
            { num: 1, label: 'Address', icon: MapPin },
            { num: 2, label: 'Payment', icon: CreditCard },
          ].map(({ num, label, icon: Icon }) => (
            <div key={num} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step >= num ? 'bg-sky-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}>
                {num}
              </div>
              <span className={`text-sm font-medium ${step >= num ? 'text-sky-600' : 'text-slate-400'}`}>{label}</span>
              {num < 2 && <div className={`w-16 h-0.5 ${step > num ? 'bg-sky-600' : 'bg-slate-200 dark:bg-slate-700'}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left — Form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
              >
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-sky-600" />
                  Delivery Address
                </h2>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={e => handleAddressChange('fullName', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                      placeholder="Rahul Sharma"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Phone *</label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={e => handleAddressChange('phone', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                      placeholder="9876543210"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Street Address *</label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={e => handleAddressChange('street', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                      placeholder="House No, Building, Street, Area"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">City *</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={e => handleAddressChange('city', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">State *</label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={e => handleAddressChange('state', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                      placeholder="Maharashtra"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">PIN Code *</label>
                    <input
                      type="text"
                      value={address.pincode}
                      onChange={e => handleAddressChange('pincode', e.target.value)}
                      maxLength={6}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                      placeholder="400001"
                    />
                  </div>
                </div>

                <button
                  onClick={() => { if (validateAddress()) setStep(2) }}
                  className="mt-6 w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors text-sm"
                >
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
              >
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-sky-600" />
                  Payment Method
                </h2>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  {[
                    { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: '💰' },
                    { value: 'whatsapp', label: 'Pay via WhatsApp', desc: 'Quick UPI / bank transfer via WhatsApp', icon: '💬' },
                  ].map(opt => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === opt.value
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={opt.value}
                        checked={paymentMethod === opt.value}
                        onChange={() => setPaymentMethod(opt.value)}
                        className="sr-only"
                      />
                      <span className="text-2xl">{opt.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800 dark:text-white">{opt.label}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{opt.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === opt.value ? 'border-sky-600' : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {paymentMethod === opt.value && <div className="w-2.5 h-2.5 bg-sky-600 rounded-full" />}
                      </div>
                    </label>
                  ))}
                </div>

                {/* Delivery address summary */}
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Delivering to</p>
                    <button onClick={() => setStep(1)} className="text-xs text-sky-600 hover:text-sky-700 font-semibold">Change</button>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">{address.fullName}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{address.street}, {address.city}, {address.state} - {address.pincode}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{address.phone}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-[2] py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      `Place Order — ₹${total.toLocaleString('en-IN')}`
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right — Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sticky top-28">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4">Order Summary ({cartItems.length} items)</h3>

              <div className="max-h-64 overflow-y-auto space-y-3 mb-4 pr-1">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{item.name}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white whitespace-nowrap">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-emerald-600 font-semibold' : ''}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    Add ₹{(999 - subtotal).toLocaleString('en-IN')} more for free shipping
                  </p>
                )}
                <div className="flex justify-between text-base font-bold text-slate-800 dark:text-white pt-3 border-t border-slate-200 dark:border-slate-700">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Secure checkout. Your data is safe with us.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
