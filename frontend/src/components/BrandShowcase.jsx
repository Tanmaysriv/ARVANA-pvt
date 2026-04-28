import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const reviews = [
  {
    quote: "The AR try-on is incredible! I could see exactly how the sneakers looked on me before buying. No more guessing sizes.",
    name:    "Priya S.",
    role:    "Verified Buyer",
    rating:  5,
    product: "Nike Air Max 270",
    image:   "https://i.pravatar.cc/150?img=1",
    color:   "from-primary-600/20 to-violet-600/20",
  },
  {
    quote: "I was hesitant to buy a watch online, but the virtual try-on showed me exactly how it looks on my wrist. Spot on!",
    name:    "Arjun M.",
    role:    "Verified Buyer",
    rating:  5,
    product: "Smart Watch Pro",
    image:   "https://i.pravatar.cc/150?img=3",
    color:   "from-emerald-600/20 to-teal-600/20",
  },
  {
    quote: "Bought a bag for my mom using AR and it looked even better in person! Delivery was fast and packaging was gorgeous.",
    name:    "Sneha R.",
    role:    "Verified Buyer",
    rating:  5,
    product: "Leather Tote Bag",
    image:   "https://i.pravatar.cc/150?img=5",
    color:   "from-pink-600/20 to-rose-600/20",
  },
]

const STATS = [
  { value: '4.9★', label: 'Avg. Rating' },
  { value: '12K+', label: 'Happy Customers' },
  { value: '98%',  label: 'Satisfaction Rate' },
  { value: '50K+', label: 'Orders Shipped' },
]

const BrandShowcase = () => {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-obsidian-950">
      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox%3D%220 0 512 512%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter id%3D%22n%22%3E%3CfeTurbulence type%3D%22fractalNoise%22 baseFrequency%3D%220.75%22 numOctaves%3D%224%22 stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect width%3D%22100%25%22 height%3D%22100%25%22 filter%3D%22url%28%23n%29%22 opacity%3D%220.05%22%2F%3E%3C%2Fsvg%3E')]" />
      
      {/* Aurora glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary-700/15 blur-[120px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="section-eyebrow mb-5 inline-flex">Social Proof</span>
          <h2 className="text-4xl md:text-5xl font-bold font-sora text-white mb-4">
            What Customers
            <span className="gradient-text"> Are Saying</span>
          </h2>
          <div className="flex items-center justify-center gap-3 text-slate-400 text-sm">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="font-semibold text-white">4.9</span>
            <span>from 12,000+ reviews</span>
          </div>
        </motion.div>

        {/* ── Review Cards ── */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="relative group h-full"
            >
              {/* Card */}
              <div className="relative h-full bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl border border-white/[0.12] rounded-3xl p-8 overflow-hidden shadow-2xl transition-all duration-500 group-hover:border-white/[0.2] group-hover:from-white/[0.12] group-hover:to-white/[0.05]">
                {/* Animated gradient shimmer on hover */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${review.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}
                  animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Quote icon with animation */}
                <motion.div 
                  className="relative z-10 mb-6 text-primary-400 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Quote className="w-8 h-8 fill-primary-400" />
                </motion.div>

                {/* Stars with stagger animation */}
                <motion.div 
                  className="relative z-10 flex gap-1 mb-5"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                >
                  {[...Array(review.rating)].map((_, j) => (
                    <motion.div
                      key={j}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 + j * 0.1, type: "spring", stiffness: 200 }}
                    >
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Quote text with fade in */}
                <motion.p 
                  className="relative z-10 text-slate-300 text-sm leading-relaxed mb-7 line-clamp-3"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.25 }}
                >
                  "{review.quote}"
                </motion.p>

                {/* Footer */}
                <motion.div 
                  className="relative z-10 flex items-center justify-between"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.3 }}
                >
                  <motion.div 
                    className="flex items-center gap-3 flex-1"
                    whileHover={{ x: 4 }}
                  >
                    <motion.img
                      src={review.image}
                      alt={review.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-white/10"
                      whileHover={{ scale: 1.1 }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-white font-sora">{review.name}</p>
                      <p className="text-[11px] text-emerald-400 font-medium">{review.role}</p>
                    </div>
                  </motion.div>
                  <motion.span 
                    className="text-[10px] bg-white/5 border border-white/10 text-slate-400 px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-white/10 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                  >
                    {review.product}
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Trust Stats Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-3xl overflow-hidden border border-white/10"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="bg-obsidian-900/70 backdrop-blur-lg py-10 px-6 text-center hover:bg-white/8 transition-all duration-300 border-r border-white/5 last:border-r-0"
            >
              <motion.p 
                className="text-4xl font-bold font-sora bg-gradient-to-r from-primary-400 to-amber-400 bg-clip-text text-transparent mb-2"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
              >
                {stat.value}
              </motion.p>
              <motion.p 
                className="text-xs text-slate-400 uppercase tracking-widest font-semibold"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                {stat.label}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default BrandShowcase
