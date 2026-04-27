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
    <section id="categories" className="py-16 md:py-24 bg-white dark:bg-slate-900 relative overflow-hidden">
      {/* Subtle Background Decor */}
      <div className="absolute top-1/2 w-full h-[500px] bg-gradient-to-b from-slate-50/50 to-transparent dark:from-slate-800/30 transform -rotate-6 pointer-events-none -z-0" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex items-center justify-between mb-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
              Shop by Category
            </h2>
            <div className="h-1 w-12 bg-sky-500 rounded-full mt-3" />
          </motion.div>
          {hasMore && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setExpanded(prev => !prev)}
              className="inline-flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold bg-sky-50 dark:bg-sky-900/20 px-5 py-2.5 rounded-full hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-colors shadow-sm cursor-pointer"
            >
              {expanded ? (
                <>View Less <ChevronUp className="w-5 h-5" /></>
              ) : (
                <>View All <ArrowRight className="w-5 h-5" /></>
              )}
            </motion.button>
          )}
        </div>

        {categories.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="aspect-square rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse shadow-sm" />
            ))}
          </div>
        ) : (
        <div className={`grid grid-cols-2 ${getGridCols(visible.length)} gap-6 md:gap-8`}>
          <AnimatePresence mode="popLayout">
            {visible.map((cat, i) => (
              <motion.div
                key={cat.slug}
                layout
                onClick={() => navigate(`/category/${cat.slug}`)}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -8 }}
                transition={{ 
                  duration: 0.4, 
                  delay: i >= INITIAL_COUNT ? (i - INITIAL_COUNT) * 0.1 : i * 0.1,
                  ease: "easeOut" 
                }}
                className="group relative cursor-pointer"
              >
                <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800 shadow-md group-hover:shadow-2xl group-hover:shadow-sky-500/20 transition-all duration-500 ring-1 ring-slate-200 dark:ring-slate-700">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  
                  {/* Floating Icon */}
                  <motion.div 
                    className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="text-4xl md:text-5xl mb-3 filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      {cat.icon}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-md translate-y-4 group-hover:translate-y-0 opacity-90 group-hover:opacity-100 transition-all duration-300">
                      {cat.name}
                    </h3>
                  </motion.div>
                </div>
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
