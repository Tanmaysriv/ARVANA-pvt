import { motion } from 'framer-motion'

const BrandShowcase = () => {
  // Brand logos - using inline SVG to avoid external requests
  const brands = [
    { name: 'Nike' },
    { name: 'Adidas' },
    { name: 'Gucci' },
    { name: 'Prada' },
    { name: 'Burberry' },
    { name: 'Zara' },
    { name: 'H&M' },
    { name: 'Uniqlo' }
  ]

  // Generate inline SVG logo
  const generateLogo = (name) => {
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="150" height="50" xmlns="http://www.w3.org/2000/svg">
        <rect width="150" height="50" fill="#0ea5e9" rx="8"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
              font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white">
          ${name}
        </text>
      </svg>
    `)}`
  }

  const testimonials = [
    {
      quote: "ARVANA's AR technology increased our online conversion rates by 95% and reduced returns by 64%. Game-changing for our e-commerce strategy.",
      author: "Sarah Johnson",
      role: "Head of Digital Innovation",
      company: "Luxury Fashion Brand",
      image: "https://i.pravatar.cc/150?img=1"
    },
    {
      quote: "The 3D visualization and virtual try-on features have transformed how our customers shop online. Implementation was seamless and ROI was immediate.",
      author: "Michael Chen",
      role: "E-commerce Director",
      company: "Global Footwear Brand",
      image: "https://i.pravatar.cc/150?img=3"
    },
    {
      quote: "We've seen a 3x increase in customer engagement and significantly lower return rates. The technology is incredibly accurate and easy to integrate.",
      author: "Emma Williams",
      role: "VP of Marketing",
      company: "Premium Accessories Brand",
      image: "https://i.pravatar.cc/150?img=5"
    }
  ]

  return (
    <section className="py-20 bg-primary-50 dark:bg-slate-900">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Trusted by Leading Fashion Brands
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Join 100+ global brands transforming their digital shopping experience
          </p>
        </motion.div>

        {/* Brand Logos Grid */}
        <div className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {brands.map((brand, index) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-white dark:hover:bg-slate-700 hover:shadow-lg transition-all duration-300 group"
              >
                <img 
                  src={generateLogo(brand.name)} 
                  alt={brand.name}
                  className="h-12 w-auto grayscale group-hover:grayscale-0 transition-all duration-300 opacity-60 group-hover:opacity-100"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700"
            >
              {/* Quote */}
              <div className="mb-6">
                <svg className="w-10 h-10 text-sky-500 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center space-x-4 border-t border-slate-200 dark:border-slate-600 pt-6">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{testimonial.author}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role}</div>
                  <div className="text-sm text-sky-600">{testimonial.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-sky-600 to-purple-600 rounded-2xl p-12 text-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">100+</div>
              <div className="text-sky-100">Partner Brands</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50M+</div>
              <div className="text-sky-100">AR Sessions</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">95%</div>
              <div className="text-sky-100">Conversion Lift</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">64%</div>
              <div className="text-sky-100">Return Reduction</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default BrandShowcase
