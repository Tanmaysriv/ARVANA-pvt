import { motion } from 'framer-motion'
import { Monitor, Smartphone, Tablet, Globe, Zap, Shield } from 'lucide-react'

const WebDemo = () => {
  const platforms = [
    {
      icon: Globe,
      name: 'Web Browser',
      description: 'Works on all modern browsers without any plugins or downloads'
    },
    {
      icon: Smartphone,
      name: 'Mobile',
      description: 'Native AR experience on iOS and Android devices'
    },
    {
      icon: Tablet,
      name: 'Tablet',
      description: 'Optimized for iPad and Android tablets'
    },
    {
      icon: Monitor,
      name: 'Desktop',
      description: '3D viewer with full interaction on desktop computers'
    }
  ]

  const features = [
    {
      icon: Zap,
      title: 'Instant Loading',
      description: 'Lightning-fast 3D model loading with progressive rendering'
    },
    {
      icon: Shield,
      title: 'No Installation',
      description: 'Zero downloads required - works directly in the browser'
    },
    {
      icon: Globe,
      title: 'Cross-Platform',
      description: 'Seamless experience across all devices and browsers'
    }
  ]

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full mb-6">
            <span className="text-white font-medium">Web Demo Available</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Try Our Technology
            <span className="gradient-text block mt-2">Right in Your Browser</span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Experience the power of our AR and 3D technology without any downloads or installations. 
            Works seamlessly across all devices.
          </p>
        </motion.div>

        {/* Platforms Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {platforms.map((platform, index) => {
            const Icon = platform.icon
            return (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-sky-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-sky-500/30 transition-colors">
                  <Icon className="w-6 h-6 text-sky-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {platform.name}
                </h3>
                <p className="text-sm text-slate-400">
                  {platform.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <a 
              href="#catalog" 
              className="btn-primary bg-white text-slate-900 hover:bg-slate-100 inline-flex items-center space-x-2 text-lg px-8 py-4"
            >
              <span>Try Live Demo</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.div>
            </a>
            <a 
              href="#contact" 
              className="btn-secondary border-2 border-white/20 text-white hover:bg-white/10 inline-flex items-center space-x-2 text-lg px-8 py-4"
            >
              <span>Schedule Demo Call</span>
            </a>
          </div>
          
          <p className="text-slate-400 mt-6">
            No credit card required • Instant access • Full feature set
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default WebDemo
