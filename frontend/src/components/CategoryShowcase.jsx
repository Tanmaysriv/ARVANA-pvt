import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronUp, MoveRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const categoryDefaults = {
  shoes:   { image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80' },
  bags:    { image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80' },
  watches: { image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80' },
  clothes: { image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80' },
}
const defaultImage = 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80'

const INITIAL_COUNT = 4

const CategoryShowcase = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [expanded, setExpanded]     = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getCategories()
        if (res.success && res.data) {
          const filtered = res.data.filter(cat => {
            const slug = cat.id || cat.categoryId
            return slug !== 'all' && slug !== 'all-products'
          })
          setCategories(filtered.map(cat => ({
            name:  cat.name,
            slug:  cat.id || cat.categoryId,
            icon:  cat.icon || '🛍️',
            image: categoryDefaults[cat.id || cat.categoryId]?.image || defaultImage,
          })))
        }
      } catch { /* keep empty */ }
    }
    load()
  }, [])

  const visible = expanded ? categories : categories.slice(0, INITIAL_COUNT)
  const hasMore = categories.length > INITIAL_COUNT

  return (
    <section
      id="categories"
      className="py-20 md:py-28 bg-white dark:bg-obsidian-950 relative overflow-hidden"
    >
      {/* Subtle top gradient bleed from hero */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6">
        {/* ── Section Header ── */}
        <div className="flex items-end justify-between mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-eyebrow mb-4 inline-flex">Browse Categories</span>
            <h2 className="text-4xl md:text-5xl font-bold font-sora text-slate-900 dark:text-white leading-tight">
              Shop by
              <span className="gradient-text"> Category</span>
            </h2>
            <div className="mt-3 h-0.5 w-16 bg-gradient-to-r from-primary-500 to-violet-500 rounded-full" />
          </motion.div>

          {hasMore && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setExpanded(p => !p)}
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-primary-500 dark:text-primary-400
                         bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20
                         px-5 py-2.5 rounded-full hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-all duration-300"
            >
              {expanded ? <><ChevronUp className="w-4 h-4" /> Show Less</> : <>View All <ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          )}
        </div>

        {/* ── Skeleton ── */}
        {categories.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[3/4] rounded-3xl bg-slate-100 dark:bg-obsidian-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            <AnimatePresence mode="popLayout">
              {visible.map((cat, i) => (
                <motion.div
                  key={cat.slug}
                  layout
                  onClick={() => navigate(`/category/${cat.slug}`)}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.5, delay: i < INITIAL_COUNT ? i * 0.08 : (i - INITIAL_COUNT) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  onHoverStart={() => setHoveredIndex(i)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  className="group relative cursor-pointer select-none"
                >
                  {/* Number accent */}
                  <div className="absolute -top-3 -left-1 z-20 w-7 h-7 rounded-full bg-obsidian-950 dark:bg-obsidian-950 border border-white/10 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary-400 font-sora">0{i + 1}</span>
                  </div>

                  {/* Card */}
                  <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-lg group-hover:shadow-card-hover transition-shadow duration-500">
                    {/* Image */}
                    <motion.img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                      animate={{ scale: hoveredIndex === i ? 1.08 : 1 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    />

                    {/* Gradient overlay — always present */}
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/90 via-obsidian-950/20 to-transparent" />

                    {/* Content — slides up on hover */}
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="transform transition-transform duration-500 ease-out group-hover:-translate-y-2">
                        <div className="text-3xl mb-2 filter drop-shadow-lg">{cat.icon}</div>
                        <h3 className="text-xl md:text-2xl font-bold text-white font-sora leading-tight">
                          {cat.name}
                        </h3>
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: hoveredIndex === i ? 1 : 0, y: hoveredIndex === i ? 0 : 8 }}
                          transition={{ duration: 0.25 }}
                          className="mt-2 flex items-center gap-1.5 text-primary-400 text-sm font-semibold"
                        >
                          Browse collection <MoveRight className="w-4 h-4" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Hover neon border */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl border-2 border-primary-500/0 pointer-events-none"
                      animate={{ borderColor: hoveredIndex === i ? 'rgba(99,102,241,0.5)' : 'rgba(99,102,241,0)' }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Mobile "View All" */}
        {hasMore && (
          <div className="sm:hidden flex justify-center mt-6">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setExpanded(p => !p)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500
                         bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20
                         px-5 py-2.5 rounded-full transition-all"
            >
              {expanded ? <><ChevronUp className="w-4 h-4" /> Show Less</> : <>View All <ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          </div>
        )}
      </div>
    </section>
  )
}

export default CategoryShowcase
