import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Sparkles, ShoppingCart, Heart, Sun, Moon, Search, ArrowRight, User, LogOut, ChevronDown, Package, Shield } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showCatDropdown, setShowCatDropdown] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { getCartCount, getWishlistCount, toggleCart, toggleWishlist } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const userDropdownRef = useRef(null)

  // ─── Search state ───
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const searchInputRef = useRef(null)
  const searchContainerRef = useRef(null)
  const debounceRef = useRef(null)

  const cartCount = getCartCount()
  const wishlistCount = getWishlistCount()

  const [categoryLinks, setCategoryLinks] = useState([
    { label: 'Shoes', slug: 'shoes', icon: '👟' },
    { label: 'Bags', slug: 'bags', icon: '👜' },
    { label: 'Clothes', slug: 'clothes', icon: '👕' },
    { label: 'Watches', slug: 'watches', icon: '⌚' },
  ])

  // Fetch categories dynamically
  useEffect(() => {
    const loadCats = async () => {
      try {
        const res = await api.getCategories()
        if (res.success && res.data) {
          const filtered = res.data.filter(cat => {
            const slug = cat.id || cat.categoryId
            return slug !== 'all' && slug !== 'all-products'
          })
          if (filtered.length > 0) {
            setCategoryLinks(filtered.map(cat => ({
              label: cat.name,
              slug: cat.id || cat.categoryId,
              icon: cat.icon || '🛍️',
            })))
          }
        }
      } catch {
        // keep fallback
      }
    }
    loadCats()
  }, [])

  // Fetch suggestions with debounce
  const [matchedCategories, setMatchedCategories] = useState([])

  const fetchSuggestions = useCallback(async (q) => {
    if (!q || q.trim().length < 2) {
      setSuggestions([])
      setMatchedCategories([])
      return
    }
    setLoadingSuggestions(true)
    try {
      // Fetch products and categories in parallel
      const [prodRes, catRes] = await Promise.all([
        api.getProducts({ search: q.trim() }),
        api.getCategories().catch(() => ({ data: [] })),
      ])
      setSuggestions((prodRes.data || []).slice(0, 5))

      // Match categories by name or id
      const lower = q.trim().toLowerCase()
      const matched = (catRes.data || []).filter(
        c => c.name?.toLowerCase().includes(lower) || c.categoryId?.toLowerCase().includes(lower) || c.id?.toLowerCase?.()?.includes(lower)
      )
      setMatchedCategories(matched.slice(0, 3))
    } catch {
      setSuggestions([])
      setMatchedCategories([])
    } finally {
      setLoadingSuggestions(false)
    }
  }, [])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(searchQuery), 300)
    return () => clearTimeout(debounceRef.current)
  }, [searchQuery, fetchSuggestions])

  // Close search on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchOpen(false)
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus()
  }, [searchOpen])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    setSearchOpen(false)
    setSearchQuery('')
    setSuggestions([])
  }

  const handleSuggestionClick = (product) => {
    navigate(`/product/${product.id}`)
    setSearchOpen(false)
    setSearchQuery('')
    setSuggestions([])
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass-effect shadow-lg backdrop-blur-xl border-b border-white/20 dark:border-slate-700/20">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Sparkles className="w-9 h-9 text-sky-600 animate-pulse-slow" />
              <div className="absolute inset-0 bg-sky-400 blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            </div>
            <span className="text-3xl font-bold gradient-text hover:scale-105 transition-transform cursor-pointer">
              ARVANA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="relative text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-all font-medium group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setShowCatDropdown(true)}
              onMouseLeave={() => setShowCatDropdown(false)}
            >
              <Link to="/#categories" className="relative text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-all font-medium group">
                Categories
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              {showCatDropdown && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 min-w-[180px]">
                    {categoryLinks.map(c => (
                      <button
                        key={c.slug}
                        onClick={() => { navigate(`/category/${c.slug}`); setShowCatDropdown(false) }}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 dark:hover:text-sky-400 transition-colors flex items-center gap-3 font-medium"
                      >
                        <span className="text-lg">{c.icon}</span>
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link to="/#catalog" className="relative text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-all font-medium group">
              Shop
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/#contact" className="relative text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-all font-medium group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Search */}
            <div className="relative" ref={searchContainerRef}>
              {!searchOpen ? (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300 hover:scale-110 active:scale-95"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                </button>
              ) : (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-64 pl-10 pr-10 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); setSuggestions([]) }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </form>
              )}

              {/* Suggestions Dropdown */}
              {searchOpen && searchQuery.trim().length >= 2 && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                  {loadingSuggestions ? (
                    <div className="p-4 space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 animate-pulse">
                          <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                          <div className="flex-1 space-y-1.5">
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : suggestions.length > 0 || matchedCategories.length > 0 ? (
                    <>
                      {/* Category matches */}
                      {matchedCategories.length > 0 && (
                        <div className="border-b border-slate-100 dark:border-slate-700">
                          <p className="px-4 pt-3 pb-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Categories</p>
                          {matchedCategories.map(cat => (
                            <button
                              key={cat.categoryId || cat.id}
                              onClick={() => {
                                navigate(`/category/${cat.categoryId || cat.id}`)
                                setSearchOpen(false)
                                setSearchQuery('')
                                setSuggestions([])
                                setMatchedCategories([])
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors text-left"
                            >
                              <span className="text-lg">{cat.icon || '🛍️'}</span>
                              <span className="text-sm font-semibold text-slate-800 dark:text-white">Browse {cat.name}</span>
                              <ArrowRight className="w-4 h-4 text-slate-400 ml-auto flex-shrink-0" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Product matches */}
                      {suggestions.length > 0 && (
                        <>
                          {matchedCategories.length > 0 && (
                            <p className="px-4 pt-3 pb-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Products</p>
                          )}
                          {suggestions.map(p => (
                        <button
                          key={p.id}
                          onClick={() => handleSuggestionClick(p)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors text-left"
                        >
                          <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{p.name}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500 dark:text-slate-400">{p.brand}</span>
                              <span className="text-xs font-bold text-sky-600 dark:text-sky-400">₹{p.price.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        </button>
                      ))}
                        </>
                      )}
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full px-4 py-3 text-sm font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors border-t border-slate-100 dark:border-slate-700 flex items-center justify-center gap-2"
                      >
                        View all results for "{searchQuery}"
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-sm text-slate-500 dark:text-slate-400">No products found for "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => navigate('/wishlist')}
              className="relative p-2.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-sky-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User / Auth */}
            {isAuthenticated && user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300"
                >
                  <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[80px] truncate">
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setShowUserDropdown(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 transition-colors font-medium"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setShowUserDropdown(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 transition-colors font-medium"
                    >
                      <Package className="w-4 h-4" />
                      My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserDropdown(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 transition-colors font-medium"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    {user.role === 'seller' && (
                      <Link
                        to="/seller"
                        onClick={() => setShowUserDropdown(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 transition-colors font-medium"
                      >
                        <Shield className="w-4 h-4" />
                        Seller Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); setShowUserDropdown(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <User className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button & Icons */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </button>
            
            {/* Mobile Wishlist */}
            <button
              onClick={() => navigate('/wishlist')}
              className="relative p-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Mobile Cart */}
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-sky-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="text-gray-700 dark:text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 animate-fade-in">
            {/* Mobile Search */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!searchQuery.trim()) return
                navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
                setIsMenuOpen(false)
                setSearchQuery('')
              }}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
              />
            </form>

            <Link 
              to="/" 
              onClick={() => setIsMenuOpen(false)}
              className="block text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-medium"
            >
              Home
            </Link>
            <div className="space-y-2">
              <span className="block text-slate-700 dark:text-slate-300 font-medium">Categories</span>
              <div className="pl-4 space-y-2">
                {categoryLinks.map(c => (
                  <Link
                    key={c.slug}
                    to={`/category/${c.slug}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-sm font-medium"
                  >
                    <span>{c.icon}</span> {c.label}
                  </Link>
                ))}
              </div>
            </div>
            <Link 
              to="/#catalog" 
              onClick={() => setIsMenuOpen(false)}
              className="block text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-medium"
            >
              Shop
            </Link>
            <Link 
              to="/#contact" 
              onClick={() => setIsMenuOpen(false)}
              className="block text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-medium"
            >
              Contact
            </Link>

            {/* Mobile Auth */}
            {isAuthenticated && user ? (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center text-sm font-bold uppercase">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 text-sm font-medium transition-colors"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 text-sm font-medium transition-colors"
                >
                  <Package className="w-4 h-4" />
                  My Orders
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 text-sm font-medium transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
                {user.role === 'seller' && (
                  <Link
                    to="/seller"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm font-medium transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    Seller Dashboard
                  </Link>
                )}
                <button
                  onClick={() => { logout(); setIsMenuOpen(false) }}
                  className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium hover:text-red-700 dark:hover:text-red-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition-colors justify-center"
                >
                  <User className="w-4 h-4" />
                  Login / Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
