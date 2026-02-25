import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, CheckCircle, Gift, AlertCircle } from 'lucide-react'
import api from '../services/api'

const ContactForm = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')
    try {
      const res = await api.subscribe(email)
      if (!res.success) throw new Error(res.error || 'Subscription failed')
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setEmail('')
      }, 4000)
    } catch (err) {
      setError(err.message || 'Something went wrong')
      setTimeout(() => setError(''), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-12 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-8 md:px-12 py-10">
            {/* Left */}
            <div className="flex items-start gap-4 max-w-md">
              <div className="flex-shrink-0 w-12 h-12 bg-sky-500/20 rounded-xl flex items-center justify-center">
                <Gift className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  Get 10% Off Your First Order
                </h3>
                <p className="text-sm text-slate-400">
                  Subscribe for exclusive deals, new arrivals, and style tips. Unsubscribe anytime.
                </p>
              </div>
            </div>

            {/* Right — Form */}
            <div className="w-full md:w-auto">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <div className="relative flex-1 min-w-[240px]">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center gap-2 px-6 py-3 whitespace-nowrap text-sm disabled:opacity-60"
                  >
                    {loading ? 'Subscribing...' : 'Subscribe'} {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <CheckCircle className="w-5 h-5" />
                  <span>You're in! Check your inbox for your discount code.</span>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm mt-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ContactForm
