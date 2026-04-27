import { motion } from 'framer-motion'
import { ArrowRight, Camera, Truck, RefreshCcw, ShieldCheck, Sparkles } from 'lucide-react'

const HeroB2B = () => {
  // Staggered animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  }

  return (
    <section id="home" className="relative pt-24 pb-4 bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/20 dark:bg-sky-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-pink-500/20 dark:bg-pink-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

      {/* Main Banner */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative rounded-3xl overflow-hidden bg-slate-900 min-h-[500px] md:min-h-[560px] shadow-2xl shadow-sky-900/20"
        >
          {/* Background Image with Parallax feel */}
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/30" />

          {/* Content */}
          <div className="relative z-10 flex items-center min-h-[500px] md:min-h-[560px] px-8 md:px-16">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-2xl"
            >
              <motion.div variants={itemVariants}>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500/20 to-purple-500/20 border border-sky-500/30 text-sky-300 text-sm font-bold tracking-wide px-5 py-2 rounded-full mb-6 backdrop-blur-sm shadow-inner shadow-white/5">
                  <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
                  Next-Gen AR Virtual Try-On
                </div>
              </motion.div>

              <motion.h1 
                variants={itemVariants}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight"
              >
                Try It On.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-400 to-pink-400 animate-gradient-x">
                  Love It. Buy It.
                </span>
              </motion.h1>

              <motion.p 
                variants={itemVariants}
                className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl leading-relaxed font-light"
              >
                Experience the future of fashion. See how shoes, bags, watches & clothes look on you — live from your camera. No guesswork, just confidence.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#catalog" 
                  className="relative overflow-hidden group bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold text-base px-8 py-4 rounded-xl shadow-lg shadow-sky-500/30 flex items-center gap-3 transition-all"
                >
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                  <span className="relative z-10 flex items-center gap-2">Shop Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                </motion.a>
                
                <motion.a 
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  href="#catalog" 
                  className="inline-flex items-center gap-2 font-medium text-base px-8 py-4 border-2 border-white/20 text-white rounded-xl backdrop-blur-sm transition-all"
                >
                  Explore AR Preview
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Trust Strip - Animated Scroll-in */}
      <div className="container mx-auto px-4 sm:px-6 mt-8 relative z-20">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: Camera, label: 'AR Virtual Try-On', sub: 'See it on you first', color: 'from-sky-500 to-blue-500', shadow: 'shadow-sky-500/20' },
            { icon: Truck, label: 'Free Shipping', sub: 'On orders over ₹999', color: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-500/20' },
            { icon: RefreshCcw, label: '30-Day Returns', sub: 'No questions asked', color: 'from-purple-500 to-pink-500', shadow: 'shadow-purple-500/20' },
            { icon: ShieldCheck, label: 'Secure Checkout', sub: '100% protected', color: 'from-amber-400 to-orange-500', shadow: 'shadow-orange-500/20' }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
              }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-lg shadow-slate-200/50 dark:shadow-none hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
            >
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} ${item.shadow} shadow-lg text-white flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm md:text-base font-bold text-slate-900 dark:text-white truncate">{item.label}</div>
                <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">{item.sub}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default HeroB2B
