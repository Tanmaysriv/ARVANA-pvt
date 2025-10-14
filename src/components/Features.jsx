import { Camera, Smartphone, Zap, Shield, Sparkles, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: Camera,
    title: 'Real-Time AR',
    description: 'Experience products in real-time with advanced augmented reality technology.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    icon: Smartphone,
    title: 'Mobile Optimized',
    description: 'Works seamlessly on any device—desktop, tablet, or smartphone.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'See how products look on you instantly with zero lag or delay.',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your images are processed locally and never stored on our servers.',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    icon: Sparkles,
    title: 'AI-Powered',
    description: 'Advanced AI ensures accurate fitting and realistic visualization.',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100'
  },
  {
    icon: TrendingUp,
    title: 'Size Recommendations',
    description: 'Get personalized size recommendations based on your measurements.',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
  }
]

const Features = () => {
  return (
    <section id="features" className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              ARVANA
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Revolutionary features that make virtual try-on feel like the real thing
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card p-8 hover:scale-105 transition-transform duration-300"
            >
              <div className={`${feature.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mb-6`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          id="how-it-works"
          className="mt-20"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-xl font-bold mb-2">Choose Product</h4>
              <p className="text-gray-600">Browse our catalog and select the item you want to try</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-xl font-bold mb-2">Enable Camera</h4>
              <p className="text-gray-600">Allow camera access to start the AR experience</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-xl font-bold mb-2">Try It On</h4>
              <p className="text-gray-600">See the product on you in real-time and make your decision</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Features
