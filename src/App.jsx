import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Header from './components/Header'
import HeroB2B from './components/HeroB2B'
import CategoryShowcase from './components/CategoryShowcase'
import Solutions from './components/Solutions'
import ProcessSteps from './components/ProcessSteps'
import WebDemo from './components/WebDemo'
import ProductCatalog from './components/ProductCatalog'
import BrandShowcase from './components/BrandShowcase'
import ContactForm from './components/ContactForm'
import ARTryOn from './components/ARTryOn'
import Footer from './components/Footer'

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showAR, setShowAR] = useState(false)

  const handleTryOn = (product) => {
    setSelectedProduct(product)
    setShowAR(true)
  }

  const handleCloseAR = () => {
    setShowAR(false)
    setSelectedProduct(null)
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-primary-100">
        <Header />
        
        <Routes>
          <Route path="/" element={
            <>
              <HeroB2B />
              <CategoryShowcase />
              <Solutions />
              <ProcessSteps />
              <WebDemo />
              <div id="catalog">
                <ProductCatalog onTryOn={handleTryOn} />
              </div>
              <BrandShowcase />
              <ContactForm />
            </>
          } />
        </Routes>
        
        <Footer />
        
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
    </Router>
  )
}

export default App
