import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [toast, setToast] = useState({ message: '', visible: false })

  // Load cart & wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('arvana-cart')
    const savedWishlist = localStorage.getItem('arvana-wishlist')
    if (savedCart) setCartItems(JSON.parse(savedCart))
    if (savedWishlist) setWishlistItems(JSON.parse(savedWishlist))
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('arvana-cart', JSON.stringify(cartItems))
  }, [cartItems])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('arvana-wishlist', JSON.stringify(wishlistItems))
  }, [wishlistItems])

  const showToast = (message) => {
    setToast({ message, visible: true })
    setTimeout(() => setToast({ message: '', visible: false }), 3000)
  }

  const hideToast = () => {
    setToast({ message: '', visible: false })
  }

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prevItems, { ...product, quantity: 1 }]
      }
    })
    showToast(`${product.name} added to cart!`)
  }

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  const toggleCart = () => {
    setIsCartOpen(prev => !prev)
    setIsWishlistOpen(false)
  }

  // Wishlist functions
  const addToWishlist = (product) => {
    setWishlistItems(prev => {
      if (prev.find(item => item.id === product.id)) {
        return prev
      }
      return [...prev, product]
    })
    showToast(`${product.name} added to wishlist!`)
  }

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId))
  }

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId)
  }

  const toggleWishlistItem = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      showToast(`${product.name} removed from wishlist`)
    } else {
      addToWishlist(product)
    }
  }

  const getWishlistCount = () => wishlistItems.length

  const toggleWishlist = () => {
    setIsWishlistOpen(prev => !prev)
    setIsCartOpen(false)
  }

  const moveToCartFromWishlist = (product) => {
    addToCart(product)
    removeFromWishlist(product.id)
  }

  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId)
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isCartOpen,
    toggleCart,
    setIsCartOpen,
    isInCart,
    // Wishlist
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlistItem,
    getWishlistCount,
    isWishlistOpen,
    toggleWishlist,
    setIsWishlistOpen,
    moveToCartFromWishlist,
    // Toast
    toast,
    showToast,
    hideToast
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
