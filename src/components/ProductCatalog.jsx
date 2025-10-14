import { useState } from 'react'
import { Camera, Heart, Box, QrCode, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { products, categories } from '../data/products'
import Product3DViewer from './Product3DViewer'
import QRCodeModal from './QRCodeModal'

const ProductCatalog = ({ onTryOn }) => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [favorites, setFavorites] = useState([])
  const [selected3DProduct, setSelected3DProduct] = useState(null)
  const [show3DViewer, setShow3DViewer] = useState(false)
  const [selectedQRProduct, setSelectedQRProduct] = useState(null)
  const [showQRModal, setShowQRModal] = useState(false)

  const handle3DView = (product) => {
    setSelected3DProduct(product)
    setShow3DViewer(true)
  }

  const handleQRCode = (product) => {
    setSelectedQRProduct(product)
    setShowQRModal(true)
  }

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  return (
    <section className="py-20 px-4 bg-primary-200">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Experience Our Technology
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Explore interactive demos across all product categories
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              <div className="relative overflow-hidden aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleQRCode(product)}
                    className="bg-emerald-600 text-white p-3 rounded-full hover:bg-emerald-700 transition-all hover:scale-110"
                    title="QR Code for Mobile"
                  >
                    <QrCode className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handle3DView(product)}
                    className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition-all hover:scale-110"
                    title="View in 3D"
                  >
                    <Box className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onTryOn(product)}
                    className="bg-sky-600 text-white p-3 rounded-full hover:bg-sky-700 transition-all hover:scale-110"
                    title="Try with AR"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className={`p-3 rounded-full transition-all hover:scale-110 ${
                      favorites.includes(product.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                    title="Add to Favorites"
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                  {product.category}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-1">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                
                {/* Colors */}
                <div className="flex gap-2 mb-3">
                  {product.colors.slice(0, 3).map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-gray-300"
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
                                       '#9ca3af'
                      }}
                      title={color}
                    />
                  ))}
                  {product.colors.length > 3 && (
                    <span className="text-xs text-gray-500 self-center">+{product.colors.length - 3}</span>
                  )}
                </div>

                <div className="mt-4">
                  <a 
                    href="#contact"
                    className="w-full btn-primary flex items-center justify-center space-x-2 text-sm py-3"
                  >
                    <span>Request Demo</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
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
