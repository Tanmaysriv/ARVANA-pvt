import { motion } from 'framer-motion'
import { ArrowRight, Camera, Truck, RefreshCcw, ShieldCheck } from 'lucide-react'

const HeroB2B = () => {
  return (
    <section id="home" className="relative pt-24 pb-4 bg-white dark:bg-slate-900">
      {/* Main Banner */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 min-h-[400px] md:min-h-[460px]">
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/85 to-slate-900/40" />

          {/* Content */}
          <div className="relative z-10 flex items-center min-h-[400px] md:min-h-[460px] px-8 md:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >
              <div className="inline-flex items-center gap-2 bg-sky-500/20 border border-sky-500/30 text-sky-300 text-sm font-medium px-4 py-1.5 rounded-full mb-5">
                <Camera className="w-4 h-4" />
                AR-Powered Shopping
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                Try It On.{' '}
                <span className="gradient-text">Love It. Buy It.</span>
              </h1>

              <p className="text-lg text-slate-300 mb-8 max-w-md">
                See how shoes, bags, watches & clothes look on you — live from your camera. No guesswork, just confidence.
              </p>

              <div className="flex flex-wrap gap-3">
                <a href="#catalog" className="btn-primary inline-flex items-center gap-2 text-base px-7 py-3.5">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </a>
                <a href="#catalog" className="inline-flex items-center gap-2 text-base px-7 py-3.5 border border-white/30 text-white rounded-xl hover:bg-white/10 transition-all">
                  New Arrivals
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Trust Strip */}
      <div className="container mx-auto px-4 sm:px-6 mt-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Camera, label: 'AR Virtual Try-On', sub: 'See it on you first' },
            { icon: Truck, label: 'Free Shipping', sub: 'On orders over ₹999' },
            { icon: RefreshCcw, label: '30-Day Returns', sub: 'No questions asked' },
            { icon: ShieldCheck, label: 'Secure Checkout', sub: '100% protected' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.label}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroB2B
