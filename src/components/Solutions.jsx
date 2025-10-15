import { motion } from 'framer-motion'
import { 
  Megaphone, 
  ShoppingCart, 
  Lightbulb, 
  Palette,
  TrendingUp,
  TrendingDown,
  Users,
  Smartphone,
  Share2,
  DollarSign,
  Leaf,
  Zap
} from 'lucide-react'

const Solutions = () => {
  const solutions = [
    {
      title: 'Digital Marketing & 3D Advertising',
      icon: Megaphone,
      color: 'from-sky-500 to-blue-600',
      benefits: [
        {
          icon: Users,
          text: 'Engage customers by interactively showcasing new collections with immersive web experiences'
        },
        {
          icon: DollarSign,
          text: 'Save on budget by supporting launches with photo/video content generated from 3D'
        },
        {
          icon: Share2,
          text: 'Promote via social media (Facebook, Instagram, Snapchat, TikTok) with 3D ads'
        },
        {
          icon: Smartphone,
          text: 'Use 3D ads for paid media campaigns with higher engagement rates'
        }
      ]
    },
    {
      title: 'Distribution, Sales & E-commerce',
      icon: ShoppingCart,
      color: 'from-purple-500 to-pink-600',
      benefits: [
        {
          icon: Smartphone,
          text: 'Create personalized in-store experiences with virtual try-on mirrors and stations'
        },
        {
          icon: Users,
          text: 'Allow customers to explore products in detail, increasing purchase confidence'
        },
        {
          icon: TrendingUp,
          text: 'Conversion rates increase by up to 95% with AR try-on technology'
        },
        {
          icon: TrendingDown,
          text: 'Return rates decrease by up to 64% with better-informed decisions'
        }
      ]
    },
    {
      title: 'Innovations',
      icon: Lightbulb,
      color: 'from-emerald-500 to-teal-600',
      benefits: [
        {
          icon: Zap,
          text: 'Streamline development with faster iterations and reduced production costs'
        },
        {
          icon: TrendingUp,
          text: 'Shorter time-to-market with digital-first product development'
        },
        {
          icon: Leaf,
          text: 'Promote sustainability by reducing physical samples and minimizing returns'
        },
        {
          icon: Users,
          text: 'Optimize production processes with data-driven insights from AR sessions'
        }
      ]
    },
    {
      title: 'Creative Operations',
      icon: Palette,
      color: 'from-orange-500 to-red-600',
      benefits: [
        {
          icon: Palette,
          text: 'Convert 3D models to 2D images or videos for e-commerce and marketing'
        },
        {
          icon: DollarSign,
          text: 'Enjoy flexibility, cost savings, and creative freedom in product presentation'
        },
        {
          icon: Lightbulb,
          text: 'Enable designers to experiment with materials, shapes, and textures digitally'
        },
        {
          icon: Zap,
          text: 'Save time and money by avoiding physical prototype production'
        }
      ]
    }
  ]

  return (
    <section id="solutions" className="py-20 bg-primary-200">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Virtual Try On and 3D Solutions
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Transform your fashion business with our comprehensive AR and 3D technology suite
          </p>
        </motion.div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {solutions.map((solution, index) => {
            const Icon = solution.icon
            return (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${solution.color} p-6 text-white`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold">
                      {solution.title}
                    </h3>
                  </div>
                </div>

                {/* Benefits */}
                <div className="p-6 space-y-4">
                  {solution.benefits.map((benefit, idx) => {
                    const BenefitIcon = benefit.icon
                    return (
                      <div 
                        key={idx}
                        className="flex items-start space-x-3 group/item hover:bg-slate-50 p-3 rounded-lg transition-colors"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover/item:bg-sky-100 transition-colors">
                          <BenefitIcon className="w-5 h-5 text-slate-600 group-hover/item:text-sky-600 transition-colors" />
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                          {benefit.text}
                        </p>
                      </div>
                    )
                  })}
                </div>

                {/* Footer */}
                <div className="px-6 pb-6">
                  <a 
                    href="#contact"
                    className="w-full btn-secondary flex items-center justify-center space-x-2"
                  >
                    <span>Learn More</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.div>
                  </a>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-sky-600 to-purple-600 rounded-2xl p-12 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Fashion Business?
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Join 100+ leading brands using our AR and 3D solutions
            </p>
            <a href="#contact" className="btn-secondary bg-white text-sky-600 hover:bg-slate-100 inline-flex items-center space-x-2 text-lg px-8 py-4">
              <span>Schedule a Demo</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.div>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Solutions
