import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import HeroB2B from './components/HeroB2B'
import CategoryShowcase from './components/CategoryShowcase'
import ProductCatalog from './components/ProductCatalog'
import BrandShowcase from './components/BrandShowcase'
import ContactForm from './components/ContactForm'
import ARTryOn from './components/ARTryOn'
import Footer from './components/Footer'
import Cart from './components/Cart'
import Wishlist from './components/Wishlist'
import Toast from './components/Toast'
import CategoryPage from './components/CategoryPage'
import ProductDetail from './components/ProductDetail'
import SearchResults from './components/SearchResults'
import AuthPage from './components/AuthPage'
import Checkout from './components/Checkout'
import Orders from './components/Orders'
import OrderDetail from './components/OrderDetail'
import Profile from './components/Profile'
import WishlistPage from './components/WishlistPage'
import CartPage from './components/CartPage'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './components/admin/AdminDashboard'
import AdminOrders from './components/admin/AdminOrders'
import AdminProducts from './components/admin/AdminProducts'
import AdminCategories from './components/admin/AdminCategories'
import AdminSellers from './components/admin/AdminSellers'
import SellerLayout from './components/seller/SellerLayout'
import SellerDashboard from './components/seller/SellerDashboard'
import SellerProducts from './components/seller/SellerProducts'
import SellerOrders from './components/seller/SellerOrders'
import { useCart } from './context/CartContext'

function AppContent() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showAR, setShowAR] = useState(false)
  const { toast, hideToast } = useCart()
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const isSeller = location.pathname.startsWith('/seller')

  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])

  const handleTryOn = (product) => {
    setSelectedProduct(product)
    setShowAR(true)
  }

  const handleCloseAR = () => {
    setShowAR(false)
    setSelectedProduct(null)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header />
      
      <Routes>
        <Route path="/" element={
          <>
            <HeroB2B />
            <CategoryShowcase />
            <div id="catalog">
              <ProductCatalog onTryOn={handleTryOn} />
            </div>
            <BrandShowcase />
            <ContactForm />
          </>
        } />
        <Route path="/category/:slug" element={<CategoryPage onTryOn={handleTryOn} />} />
        <Route path="/product/:id" element={<ProductDetail onTryOn={handleTryOn} />} />
        <Route path="/search" element={<SearchResults onTryOn={handleTryOn} />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        
        {/* Admin Panel */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="sellers" element={<AdminSellers />} />
        </Route>

        {/* Seller Panel */}
        <Route path="/seller" element={<SellerLayout />}>
          <Route index element={<SellerDashboard />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="orders" element={<SellerOrders />} />
        </Route>
      </Routes>
      
      {!isAdmin && !isSeller && <Footer />}
      
      {/* Cart Sidebar */}
      <Cart />

      {/* Wishlist Sidebar */}
      <Wishlist />

      {/* Toast Notifications */}
      <Toast 
        message={toast.message} 
        isVisible={toast.isVisible} 
        onClose={hideToast} 
      />
      
      {/* AR Modal Overlay */}
      {showAR && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black">
          <ARTryOn 
            product={selectedProduct} 
            onClose={handleCloseAR}
          />
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </Router>
  )
}

export default App
