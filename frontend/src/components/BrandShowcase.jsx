import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const BrandShowcase = () => {
  const reviews = [
    {
      quote: "The AR try-on is incredible! I could see exactly how the sneakers looked on me before buying. No more guessing sizes.",
      name: "Priya S.",
      rating: 5,
      product: "Nike Air Max 270",
      image: "https://i.pravatar.cc/150?img=1"
    },
    {
      quote: "I was hesitant to buy a watch online, but the virtual try-on showed me exactly how it looks on my wrist. Spot on!",
      name: "Arjun M.",
      rating: 5,
      product: "Smart Watch Pro",
      image: "https://i.pravatar.cc/150?img=3"
    },
    {
      quote: "Bought a bag for my mom using AR and it looked even better in person! Delivery was fast and packaging was gorgeous.",
      name: "Sneha R.",
      rating: 5,
      product: "Leather Tote Bag",
      image: "https://i.pravatar.cc/150?img=5"
    }
  ]

  return (
    <section className="py-14 bg-slate-50 dark:bg-slate-800/50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="font-semibold text-slate-900 dark:text-white">4.8</span>
            <span>from 12,000+ reviews</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4">
                "{review.quote}"
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={review.image} alt={review.name} className="w-9 h-9 rounded-full" />
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{review.name}</div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400">Verified Buyer</div>
                  </div>
                </div>
                <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full">
                  {review.product}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BrandShowcase
