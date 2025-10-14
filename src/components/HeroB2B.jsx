import { motion } from 'framer-motion'
import { ArrowRight, Play, Sparkles } from 'lucide-react'

const HeroB2B = () => {
  const categories = [
    { 
      name: 'Footwear', 
      icon: '👟', 
      desc: 'Virtual try-on for sneakers, boots, loafers, sandals with AR and 3D experiences',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'
    },
    { 
      name: 'Bags', 
      icon: '👜', 
      desc: 'Near in-store experience with 3D viewer and virtual try-on for handbags',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400'
    },
    { 
      name: 'Watches', 
      icon: '⌚', 
      desc: 'Realistic try-before-you-buy with markerless technology and animated hands',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'
    },
    { 
      name: 'Jewellery', 
      icon: '💍', 
      desc: 'True-to-life 3D with highest realism in materials and light reflections',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'
    },
    { 
      name: 'Clothes', 
      icon: '👕', 
      desc: 'Visualize apparel and pair with existing outfits for interactive journey',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
    },
    { 
      name: 'Scarves', 
      icon: '🧣', 
      desc: 'Match scarves with outfits and try various wearing options',
      image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400'
    }
  ]

  return (
    <>
      {/* Main Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8')] bg-cover bg-center opacity-10"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-primary-500/20 backdrop-blur-sm border border-primary-500/50 px-6 py-3 rounded-full mb-8">
              <Sparkles className="w-5 h-5 text-primary-400" />
              <span className="text-white font-medium">Enterprise AR & 3D Solutions</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Virtual Try On & 3D Solutions
              <br />
              <span className="gradient-text">for Fashion</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto">
              Empower your brand with cutting-edge AR technology. 
              Increase conversions, reduce returns, and create immersive shopping experiences.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="#contact" className="btn-primary flex items-center space-x-2 text-lg px-8 py-4">
                <span>Request a Demo</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <button className="btn-secondary flex items-center space-x-2 text-lg px-8 py-4">
                <Play className="w-5 h-5" />
                <span>Watch Video</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">95%</div>
                <div className="text-slate-400">Conversion Increase</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">64%</div>
                <div className="text-slate-400">Return Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">100+</div>
                <div className="text-slate-400">Global Brands</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">50M+</div>
                <div className="text-slate-400">AR Sessions</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Category Showcase Section */}
      <section className="py-20 bg-primary-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Solutions for Every Category
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Industry-leading virtual try-on and 3D visualization technology 
              tailored for your product category
            </p>
          </motion.div>

          {/* Category Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Icon */}
                  <div className="absolute top-4 right-4 w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl">
                    {category.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {category.name}
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {category.desc}
                  </p>
                  <a 
                    href={`#${category.name.toLowerCase()}`}
                    className="inline-flex items-center text-sky-600 font-semibold hover:text-sky-700 group-hover:gap-2 transition-all"
                  >
                    Explore {category.name}
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 border-2 border-sky-500 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity pointer-events-none"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default HeroB2B
