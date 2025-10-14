import { motion } from 'framer-motion'
import { Check, ArrowRight, Sparkles } from 'lucide-react'

const CategoryShowcase = () => {
  const categories = [
    {
      id: 'footwear',
      name: 'Footwear',
      tagline: 'AR Shoes and 3D Viewer',
      description: 'Virtual try-on lets brands showcase sneakers, boots, loafers, sandals, and other shoe styles in an engaging way with AR and 3D experiences, giving customers the chance to explore design details such as eye-catching soles or metallic embellishments.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      features: [
        'Realistic foot tracking and sizing',
        'Explore sole details and materials',
        'Pair with different outfits',
        'Web and mobile AR support'
      ],
      stats: {
        conversion: '+95%',
        returns: '-64%',
        engagement: '+3x'
      }
    },
    {
      id: 'bags',
      name: 'Bags',
      tagline: 'Virtual Try-On and 3D Viewer',
      description: 'Bag Virtual Try-On and 3D Viewer offer customers a near in-store shopping experience. Let them interact with the 3D bag, try it on, explore its details, and pair it with outfits. With seamless web integration, AR try-on links can be easily shared in marketing campaigns and across social media.',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
      features: [
        'Interactive 3D rotation',
        'Size and fit visualization',
        'Material and texture details',
        'Social media integration'
      ],
      stats: {
        conversion: '+87%',
        returns: '-58%',
        engagement: '+2.5x'
      }
    },
    {
      id: 'watches',
      name: 'Watches',
      tagline: 'Markerless AR Try-On',
      description: 'Virtual try-on provides your customers with a realistic "try-before-you-buy" experience, allowing them to understand the sizing, details, and fit of your iconic watches as if they were wearing them on their wrist. Our markerless technology and animated clock hands deliver a premium user experience.',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      features: [
        'Markerless wrist tracking',
        'Animated clock hands',
        'Realistic reflections',
        'Size comparison tools'
      ],
      stats: {
        conversion: '+92%',
        returns: '-71%',
        engagement: '+4x'
      }
    },
    {
      id: 'jewellery',
      name: 'Jewellery',
      tagline: 'True-to-Life 3D and AR',
      description: 'Give shoppers the possibility to discover jewellery online with the industry\'s most true-to-life 3D and virtual try on. Our proprietary technology delivers the highest realism in materials and fit, vividly showcasing the nuanced light reflections of diamonds and coloured gems.',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
      features: [
        'Diamond light reflections',
        'Gem color accuracy',
        'Ring sizing precision',
        'Multiple viewing angles'
      ],
      stats: {
        conversion: '+98%',
        returns: '-75%',
        engagement: '+5x'
      }
    },
    {
      id: 'clothes',
      name: 'Clothes',
      tagline: 'Virtual Apparel Try-On',
      description: 'Allow your customers to visualize how the brand\'s apparel would look on them by virtually trying it on and pairing it with their existing outfits. This helps overcome the limitations of online shopping and provides a more interactive user journey.',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      features: [
        'Body type adaptation',
        'Outfit pairing',
        'Size recommendations',
        'Fabric movement simulation'
      ],
      stats: {
        conversion: '+85%',
        returns: '-62%',
        engagement: '+2.8x'
      }
    },
    {
      id: 'scarves',
      name: 'Scarves',
      tagline: '3D Viewer and Virtual Try-On',
      description: 'Boost customer satisfaction and purchase confidence by allowing shoppers to match scarves with existing outfits and try various wearing options. Overcome online shopping limitations and showcase the brand\'s scarves in an engaging way with WANNA 3D Viewer and Virtual Try On.',
      image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800',
      features: [
        'Multiple wearing styles',
        'Pattern and color matching',
        'Fabric draping simulation',
        'Outfit coordination'
      ],
      stats: {
        conversion: '+78%',
        returns: '-55%',
        engagement: '+2.2x'
      }
    }
  ]

  return (
    <section className="py-20 bg-primary-100">
      <div className="container mx-auto px-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            id={category.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`mb-32 last:mb-0 ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}
          >
            <div className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              {/* Image Side */}
              <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-purple-500 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <img 
                    src={category.image}
                    alt={category.name}
                    className="relative rounded-2xl shadow-2xl w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Floating Badge */}
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-sky-600" />
                      <span className="font-semibold text-slate-900">AR Enabled</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
                <div className="inline-block bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  {category.name}
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                  {category.tagline}
                </h2>
                
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  {category.description}
                </p>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {category.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                        <Check className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8 bg-slate-50 rounded-xl p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-sky-600 mb-1">{category.stats.conversion}</div>
                    <div className="text-sm text-slate-600">Conversion</div>
                  </div>
                  <div className="text-center border-x border-slate-200">
                    <div className="text-3xl font-bold text-purple-600 mb-1">{category.stats.returns}</div>
                    <div className="text-sm text-slate-600">Returns</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600 mb-1">{category.stats.engagement}</div>
                    <div className="text-sm text-slate-600">Engagement</div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="#contact" className="btn-primary flex items-center justify-center space-x-2">
                    <span>Request Demo</span>
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  <a href="#catalog" className="btn-secondary flex items-center justify-center space-x-2">
                    <span>Try Live Demo</span>
                    <Sparkles className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default CategoryShowcase
