import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Camera, Truck, RefreshCcw, ShieldCheck, Sparkles, Play, ChevronDown } from 'lucide-react'
import { useRef } from 'react'

const MARQUEE_ITEMS = [
  '✦ AR Virtual Try-On',
  '✦ Free Shipping Over ₹999',
  '✦ 30-Day Returns',
  '✦ 12,000+ Happy Customers',
  '✦ Secure Checkout',
  '✦ New Arrivals Every Week',
  '✦ AR Virtual Try-On',
  '✦ Free Shipping Over ₹999',
  '✦ 30-Day Returns',
  '✦ 12,000+ Happy Customers',
  '✦ Secure Checkout',
  '✦ New Arrivals Every Week',
]

const TRUST_ITEMS = [
  { icon: Camera,     label: 'AR Try-On',       sub: 'See it on you first',   color: 'from-primary-500 to-violet-600', glow: 'shadow-primary-500/20' },
  { icon: Truck,      label: 'Free Shipping',    sub: 'Orders over ₹999',      color: 'from-emerald-500 to-teal-600',   glow: 'shadow-emerald-500/20' },
  { icon: RefreshCcw, label: '30-Day Returns',   sub: 'No questions asked',    color: 'from-pink-500 to-rose-600',      glow: 'shadow-pink-500/20'    },
  { icon: ShieldCheck, label: 'Secure Checkout', sub: '100% protected',        color: 'from-amber-500 to-orange-600',   glow: 'shadow-amber-500/20'   },
]

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
}

const itemVariants = {
  hidden:  { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90, damping: 18 } },
}

const HeroB2B = () => {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const bgY    = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const textY  = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex flex-col overflow-hidden bg-obsidian-950"
    >
      {/* ── Parallax Background Image ── */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80')" }}
        />
      </motion.div>

      {/* ── Aurora Orbs ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-primary-600/20 blur-[120px] animate-blob" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[100px] animate-blob animation-delay-3000" />
        <div className="absolute -bottom-20 left-1/3 w-[600px] h-[600px] rounded-full bg-primary-800/20 blur-[120px] animate-blob animation-delay-2000" />
      </div>

      {/* ── Subtle Grid ── */}
      <div className="absolute inset-0 z-0 bg-grid opacity-100 pointer-events-none" />

      {/* ── Main Hero Content ── */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 flex-1 flex items-center"
      >
        <div className="container mx-auto px-6 sm:px-8 py-32 md:py-0">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">

            {/* Left — Copy */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-2xl"
            >
              {/* Eyebrow badge */}
              <motion.div variants={itemVariants} className="mb-8">
                <span className="section-eyebrow">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  Next-Gen AR Virtual Try-On
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={itemVariants}
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.05] mb-6 tracking-tight font-sora"
              >
                Try It On.
                <br />
                <span className="gradient-text animate-gradient-x">
                  Love It.
                </span>
                <br />
                <span className="text-white/90">Buy It.</span>
              </motion.h1>

              {/* Sub copy */}
              <motion.p
                variants={itemVariants}
                className="text-lg md:text-xl text-slate-400 mb-10 max-w-lg leading-relaxed font-light"
              >
                Experience the future of fashion — see exactly how shoes, bags,
                watches &amp; clothes look on{' '}
                <em className="text-white not-italic font-medium">you</em>,
                live from your camera. No guesswork, just confidence.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  href="#catalog"
                  className="btn-primary flex items-center gap-2.5 text-base"
                >
                  Shop Collection
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.04, backgroundColor: 'rgba(255,255,255,0.07)' }}
                  whileTap={{ scale: 0.96 }}
                  href="#catalog"
                  className="btn-secondary flex items-center gap-2.5 text-base"
                >
                  <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                    <Play className="w-3 h-3 fill-white ml-0.5" />
                  </span>
                  Explore AR Preview
                </motion.a>
              </motion.div>

              {/* Social proof pill */}
              <motion.div
                variants={itemVariants}
                className="mt-10 flex items-center gap-4"
              >
                <div className="flex -space-x-2">
                  {[1, 3, 5, 7, 9].map(n => (
                    <img
                      key={n}
                      src={`https://i.pravatar.cc/40?img=${n}`}
                      alt=""
                      className="w-8 h-8 rounded-full border-2 border-obsidian-950 object-cover"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-amber-400 text-xs">★</span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">
                    <span className="text-white font-semibold">12,000+</span> happy customers
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right — Floating Image Card */}
            <motion.div
              initial={{ opacity: 0, x: 60, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              className="hidden lg:flex justify-center items-center"
            >
              <div className="relative">
                {/* Main product card */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="relative z-10 rounded-3xl overflow-hidden shadow-luxury border border-white/10"
                  style={{ width: 340, height: 420 }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=90"
                    alt="Featured Product"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent" />

                  {/* AR badge floating */}
                  <div className="absolute top-5 right-5 bg-primary-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-glow">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    AR LIVE
                  </div>

                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-0.5">Nike</p>
                    <p className="text-white font-semibold font-sora">Air Max 270</p>
                    <p className="text-primary-400 font-bold">₹8,999</p>
                  </div>
                </motion.div>

                {/* Floating stat cards */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute -left-16 top-12 glass-dark rounded-2xl p-3.5 flex items-center gap-3 min-w-[160px] shadow-luxury z-20"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">Free Delivery</p>
                    <p className="text-slate-400 text-[10px]">Orders ₹999+</p>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
                  className="absolute -right-14 bottom-16 glass-dark rounded-2xl p-3.5 min-w-[140px] shadow-luxury z-20"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-amber-400 text-xs">★</span>
                    ))}
                  </div>
                  <p className="text-white text-sm font-bold">4.9 / 5</p>
                  <p className="text-slate-400 text-[10px]">2,841 reviews</p>
                </motion.div>

                {/* Glow blob behind card */}
                <div className="absolute inset-0 -z-10 rounded-3xl bg-primary-600/30 blur-3xl scale-110" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── Scroll Indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="relative z-10 flex justify-center pb-8"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="flex flex-col items-center gap-1 text-slate-500 cursor-pointer"
          onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>

      {/* ── Marquee Strip ── */}
      <div className="relative z-10 border-t border-white/6 bg-obsidian-900/60 backdrop-blur-sm overflow-hidden py-3.5">
        <div className="marquee-track">
          {MARQUEE_ITEMS.map((item, i) => (
            <span
              key={i}
              className="inline-block px-8 text-[11px] font-semibold uppercase tracking-widest text-slate-400 whitespace-nowrap"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Trust Cards ── */}
      <div className="relative z-10 bg-obsidian-900/80 backdrop-blur-sm border-t border-white/5">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-2 md:grid-cols-4"
          >
            {TRUST_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                className={`group flex items-center gap-4 py-5 px-5 transition-colors duration-300 ${i < 3 ? 'border-r border-white/5' : ''}`}
              >
                <div className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} ${item.glow} shadow-lg text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white font-sora">{item.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{item.sub}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroB2B
