import { X, Download, Smartphone } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { motion, AnimatePresence } from 'framer-motion'

const QRCodeModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null

  // Generate URL for the product (you can customize this based on your deployment)
  const productUrl = `${window.location.origin}?product=${product.id}`

  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-code-svg')
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      
      const downloadLink = document.createElement('a')
      downloadLink.download = `${product.name}-QR.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-500 to-purple-500 rounded-full mb-4">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Scan to View on Mobile
            </h2>
            <p className="text-slate-600">
              Scan this QR code with your smartphone to view and try on this product
            </p>
          </div>

          {/* Product Info */}
          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{product.name}</h3>
                <p className="text-sm text-slate-600">{product.brand || product.category}</p>
                <p className="text-lg font-bold text-sky-600">₹{product.price.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white p-6 rounded-xl border-2 border-slate-200 mb-6 flex justify-center">
            <QRCodeSVG
              id="qr-code-svg"
              value={productUrl}
              size={200}
              level="H"
              includeMargin={true}
              fgColor="#0f172a"
              bgColor="#ffffff"
            />
          </div>

          {/* Instructions */}
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-sky-900 mb-2 flex items-center">
              <Smartphone className="w-4 h-4 mr-2" />
              How to use:
            </h4>
            <ol className="text-sm text-sky-800 space-y-1 list-decimal list-inside">
              <li>Open your smartphone camera</li>
              <li>Point it at the QR code</li>
              <li>Tap the notification to open</li>
              <li>Try on the product with AR!</li>
            </ol>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={handleDownloadQR}
              className="flex-1 btn-primary flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download QR</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Close
            </button>
          </div>

          {/* URL Display */}
          <div className="mt-4 p-3 bg-slate-100 rounded-lg">
            <p className="text-xs text-slate-600 text-center break-all">
              {productUrl}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default QRCodeModal
