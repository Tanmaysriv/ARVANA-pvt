import { Camera, Sparkles, Zap, ArrowRight, Play } from 'lucide-react'
import { motion } from 'framer-motion'

const Hero = ({ onStartTryOn }) => {
  const categories = [
    { name: 'Footwear', icon: '👟', desc: 'Sneakers, boots, sandals & more' },
    { name: 'Bags', icon: '👜', desc: 'Handbags, backpacks & accessories' },
    { name: 'Watches', icon: '⌚', desc: 'Luxury & smart watches' },
    { name: 'Jewellery', icon: '💍', desc: 'Rings, necklaces & bracelets' },
    { name: 'Clothes', icon: '👕', desc: 'Apparel & fashion wear' },
    { name: 'Scarves', icon: '🧣', desc: 'Scarves & accessories' }
  ]

  return (
    <section id="home" className="pt-24 pb-16 px-4 min-h-screen flex items-center">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Next-Gen Virtual Try-On</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Try Before You Buy with{' '}
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                AR Magic
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Experience the future of online shopping. Try on shoes, bags, clothes, and watches 
              using cutting-edge augmented reality technology—all from the comfort of your home.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onStartTryOn}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <Camera className="w-5 h-5" />
                <span>Start Virtual Try-On</span>
              </button>
              <button className="btn-secondary flex items-center justify-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div>
                <div className="text-3xl font-bold text-primary-600">10K+</div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600">98%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600">500K+</div>
                <div className="text-sm text-gray-600">Happy Users</div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Hero Image/Animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-square bg-gradient-to-br from-primary-400 via-purple-400 to-pink-400 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <Camera className="w-32 h-32 mx-auto mb-4 animate-pulse-slow" />
                  <p className="text-2xl font-semibold">AR Experience</p>
                  <p className="text-lg opacity-90">Point your camera to try on</p>
                </div>
              </div>
              
              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-8 -right-4 bg-white rounded-lg shadow-xl p-4"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg"></div>
                  <div>
                    <div className="text-xs text-gray-500">Shoes</div>
                    <div className="font-semibold">Nike Air Max</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute bottom-8 -left-4 bg-white rounded-lg shadow-xl p-4"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg"></div>
                  <div>
                    <div className="text-xs text-gray-500">Watch</div>
                    <div className="font-semibold">Smart Watch</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
