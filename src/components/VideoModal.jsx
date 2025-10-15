import { useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const VideoModal = ({ isOpen, onClose }) => {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-2 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Video Container */}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="ARVANA Demo Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Video Info */}
          <div className="p-6 bg-gradient-to-r from-sky-600 to-purple-600 text-white">
            <h3 className="text-2xl font-bold mb-2">ARVANA Virtual Try-On Demo</h3>
            <p className="text-white/90">
              See how our AR technology transforms the online shopping experience
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default VideoModal
