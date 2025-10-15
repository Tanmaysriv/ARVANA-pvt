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

          {/* Right Content - iPhone 15 Pro Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center items-center"
          >
            {/* iPhone 15 Pro Frame */}
            <div className="relative">
              {/* Phone Body */}
              <div className="relative w-[340px] h-[690px] bg-gradient-to-b from-slate-800 to-slate-900 rounded-[55px] p-3 shadow-2xl ring-1 ring-slate-700">
                {/* Dynamic Island */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-full z-10"></div>
                
                {/* Screen */}
                <div className="relative w-full h-full bg-white rounded-[45px] overflow-hidden">
                  {/* Status Bar */}
                  <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-slate-900/10 to-transparent z-10 flex items-center justify-between px-8 pt-2">
                    <span className="text-xs font-semibold text-slate-900">9:41</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-3 border border-slate-900 rounded-sm relative">
                        <div className="absolute inset-0.5 bg-slate-900 rounded-[1px]"></div>
                      </div>
                    </div>
                  </div>

                  {/* App Content - ARVANA Trial */}
                  <div className="h-full bg-gradient-to-br from-sky-50 to-purple-50 overflow-hidden">
                    {/* Mini Header */}
                    <div className="pt-14 px-6 pb-4 bg-white/80 backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">ARVANA</h2>
                        <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                          <Camera className="w-4 h-4 text-sky-600" />
                        </div>
                      </div>
                    </div>

                    {/* AR Try-On Preview */}
                    <div className="px-6 py-4 space-y-4">
                      {/* Main AR View */}
                      <motion.div 
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="relative h-[280px] bg-gradient-to-br from-sky-400 via-purple-400 to-pink-400 rounded-3xl overflow-hidden shadow-lg"
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-white">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                              <Camera className="w-20 h-20 mx-auto mb-3 opacity-90" />
                            </motion.div>
                            <p className="text-sm font-semibold">AR View Active</p>
                          </div>
                        </div>
                        
                        {/* AR Overlay Elements */}
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-semibold text-sky-600">
                          Live Preview
                        </div>
                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-semibold text-purple-600">
                          98% Match
                        </div>
                      </motion.div>

                      {/* Product Cards */}
                      <div className="grid grid-cols-3 gap-3">
                        <motion.div 
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="bg-white rounded-2xl p-3 shadow-md"
                        >
                          <div className="w-full h-16 bg-gradient-to-br from-sky-200 to-sky-300 rounded-xl mb-2 flex items-center justify-center text-2xl">
                            👟
                          </div>
                          <p className="text-[10px] font-semibold text-slate-700 text-center">Sneakers</p>
                        </motion.div>
                        
                        <motion.div 
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                          className="bg-white rounded-2xl p-3 shadow-md"
                        >
                          <div className="w-full h-16 bg-gradient-to-br from-purple-200 to-purple-300 rounded-xl mb-2 flex items-center justify-center text-2xl">
                            👜
                          </div>
                          <p className="text-[10px] font-semibold text-slate-700 text-center">Bags</p>
                        </motion.div>
                        
                        <motion.div 
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                          className="bg-white rounded-2xl p-3 shadow-md"
                        >
                          <div className="w-full h-16 bg-gradient-to-br from-pink-200 to-pink-300 rounded-xl mb-2 flex items-center justify-center text-2xl">
                            ⌚
                          </div>
                          <p className="text-[10px] font-semibold text-slate-700 text-center">Watches</p>
                        </motion.div>
                      </div>

                      {/* CTA Button */}
                      <motion.button
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-full bg-gradient-to-r from-sky-600 to-purple-600 text-white rounded-2xl py-3 font-semibold text-sm shadow-lg"
                      >
                        Start AR Try-On
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Feature Cards */}
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-8 -right-12 bg-white rounded-2xl shadow-2xl p-4 w-48"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Accuracy</div>
                    <div className="text-lg font-bold text-slate-900">98%</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                className="absolute -bottom-8 -left-12 bg-white rounded-2xl shadow-2xl p-4 w-48"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Users</div>
                    <div className="text-lg font-bold text-slate-900">500K+</div>
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
