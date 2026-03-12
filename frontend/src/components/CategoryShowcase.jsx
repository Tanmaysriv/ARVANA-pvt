import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

// Fallback images & icons for known categories
const categoryDefaults = {
  shoes:   { image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
  bags:    { image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400' },
  watches: { image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
  clothes: { image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
}
const defaultImage = 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400'

const INITIAL_COUNT = 4 // show 4 categories initially

const CategoryShowcase = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getCategories()
        if (res.success && res.data) {
          const filtered = res.data
            .filter(cat => {
              const slug = cat.id || cat.categoryId
              return slug !== 'all' && slug !== 'all-products'
            })
          setCategories(filtered.map(cat => ({
            name: cat.name,
            slug: cat.id || cat.categoryId,
            icon: cat.icon || '🛍️',
            image: categoryDefaults[cat.id || cat.categoryId]?.image || defaultImage,
          })))
        }
      } catch (err) {
        // fallback to empty
      }
    }
    load()
  }, [])

  const visible = expanded ? categories : categories.slice(0, INITIAL_COUNT)
  const hasMore = categories.length > INITIAL_COUNT

  const getGridCols = (count) => {
    if (count >= 5) return 'md:grid-cols-5'
    if (count === 4) return 'md:grid-cols-4'
    if (count === 3) return 'md:grid-cols-3'
    return 'md:grid-cols-2'
  }

  return (
    <section id="categories" className="py-12 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Shop by Category
          </h2>
          {hasMore && (
            <button
              onClick={() => setExpanded(prev => !prev)}
              className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 font-medium text-sm hover:underline transition-colors"
            >
              {expanded ? (
                <>View Less <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>View All <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          )}
        </div>

        {categories.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {[1,2,3,4].map(i => (
              <div key={i} className="aspect-square rounded-2xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
            ))}
          </div>
        ) : (
        <div className={`grid grid-cols-2 ${getGridCols(visible.length)} gap-4 md:gap-5`}>
          <AnimatePresence mode="popLayout">
            {visible.map((cat, i) => (
              <motion.div
                key={cat.slug}
                layout
                onClick={() => navigate(`/category/${cat.slug}`)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, delay: i >= INITIAL_COUNT ? (i - INITIAL_COUNT) * 0.05 : 0 }}
                className="group text-center cursor-pointer"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-2 bg-slate-100 dark:bg-slate-800">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl md:text-4xl drop-shadow-lg">{cat.icon}</span>
                  </div>
                </div>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {cat.name}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        )}
      </div>
    </section>
  )
}

export default CategoryShowcase
