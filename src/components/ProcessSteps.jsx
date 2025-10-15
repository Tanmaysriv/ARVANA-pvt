import { motion } from 'framer-motion'
import { FileText, Code, CheckCircle, Rocket } from 'lucide-react'

const ProcessSteps = () => {
  const steps = [
    {
      number: '01',
      title: 'Statement of Work Determination',
      icon: FileText,
      description: 'We analyze your business needs, define project scope, and create a detailed implementation roadmap tailored to your brand.',
      duration: '1-2 weeks',
      deliverables: ['Requirements analysis', 'Technical specification', 'Project timeline', 'Cost estimation']
    },
    {
      number: '02',
      title: 'Development',
      icon: Code,
      description: 'Our team creates high-quality 3D models, integrates AR technology, and builds custom features for your platform.',
      duration: '4-8 weeks',
      deliverables: ['3D model creation', 'AR integration', 'Custom features', 'Brand customization']
    },
    {
      number: '03',
      title: 'Quality Assurance',
      icon: CheckCircle,
      description: 'Rigorous testing across devices, browsers, and scenarios to ensure flawless performance and user experience.',
      duration: '2-3 weeks',
      deliverables: ['Cross-device testing', 'Performance optimization', 'Bug fixes', 'User acceptance testing']
    },
    {
      number: '04',
      title: 'Pilot & Adjust',
      icon: Rocket,
      description: 'Launch pilot program, gather user feedback, optimize based on real-world data, and scale to full deployment.',
      duration: '2-4 weeks',
      deliverables: ['Pilot launch', 'Analytics setup', 'Performance monitoring', 'Full deployment']
    }
  ]

  return (
    <section className="py-20 bg-primary-100 dark:bg-slate-900">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Virtual Try On: Steps to Start
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Our proven 4-step process ensures seamless implementation and maximum ROI
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-200 via-purple-200 to-emerald-200 dark:from-sky-800 dark:via-purple-800 dark:to-emerald-800 transform -translate-y-1/2 z-0"></div>

          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >
                  {/* Step Card */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 border-2 border-slate-100 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-600 group">
                    {/* Number Badge */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                        {step.number}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="mt-8 mb-4 flex justify-center">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center group-hover:bg-sky-100 dark:group-hover:bg-sky-900 transition-colors">
                        <Icon className="w-8 h-8 text-slate-600 dark:text-slate-300 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 text-center min-h-[3.5rem]">
                      {step.title}
                    </h3>

                    {/* Duration */}
                    <div className="text-center mb-4">
                      <span className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {step.duration}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 dark:text-slate-300 text-center mb-4 min-h-[4.5rem]">
                      {step.description}
                    </p>

                    {/* Deliverables */}
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Deliverables:</p>
                      <ul className="space-y-1">
                        {step.deliverables.map((deliverable, idx) => (
                          <li key={idx} className="text-sm text-slate-600 dark:text-slate-300 flex items-start">
                            <span className="text-sky-500 mr-2">•</span>
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
            Ready to get started? Let's discuss your project timeline.
          </p>
          <a href="#contact" className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4">
            <span>Start Your Project</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default ProcessSteps
