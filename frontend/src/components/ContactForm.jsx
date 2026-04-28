import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowRight, CheckCircle, AlertCircle, Sparkles } from 'lucide-react'
import api from '../services/api'

const ContactForm = () => {
  const [email, setEmail]       = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')
    try {
      const res = await api.subscribe(email)
      if (!res.success) throw new Error(res.error || 'Subscription failed')
      setSubmitted(true)
      setTimeout(() => { setSubmitted(false); setEmail('') }, 5000)
    } catch (err) {
      setError(err.message || 'Something went wrong')
      setTimeout(() => setError(''), 3500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="relative py-20 md:py-28 overflow-hidden bg-white dark:bg-obsidian-950">
      {/* Top separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/25 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl"
        >
          {/* ── Aurora gradient background ── */}
          <div className="absolute inset-0 aurora-bg" />

          {/* Noise texture */}
          <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml,%3Csvg viewBox%3D%220 0 256 256%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter id%3D%22n%22%3E%3CfeTurbulence type%3D%22fractalNoise%22 baseFrequency%3D%220.9%22 numOctaves%3D%224%22 stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect width%3D%22100%25%22 height%3D%22100%25%22 filter%3D%22url%28%23n%29%22 opacity%3D%220.05%22%2F%3E%3C%2Fsvg%3E')]" />

          {/* Glow orbs */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-violet-500/30 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-10 w-48 h-48 rounded-full bg-primary-500/20 blur-3xl pointer-events-none" />

          {/* ── Content ── */}
          <div className="relative z-10 px-8 md:px-16 py-14 md:py-20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10">
              {/* Left */}
              <div className="max-w-lg">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                  <Sparkles className="w-3.5 h-3.5 text-primary-300 animate-pulse" />
                  Exclusive Offer
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-white font-sora leading-[1.1] mb-4">
                  Style starts
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-violet-300">
                    here.
                  </span>
                </h3>
                <p className="text-slate-300 text-base leading-relaxed">
                  Subscribe for{' '}
                  <span className="text-white font-semibold">10% off</span> your first order —
                  plus exclusive deals, new arrivals &amp; style drops. Unsubscribe anytime.
                </p>
              </div>

              {/* Right — Form */}
              <div className="w-full md:w-auto md:min-w-[400px]">
                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className="input-premium pl-11 text-base"
                          />
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          type="submit"
                          disabled={loading}
                          className="btn-primary flex items-center gap-2 px-7 py-3.5 whitespace-nowrap text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Subscribing…
                            </span>
                          ) : (
                            <>Subscribe <ArrowRight className="w-4 h-4" /></>
                          )}
                        </motion.button>
                      </form>

                      {/* Error */}
                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="flex items-center gap-2 text-rose-300 text-sm mt-3"
                          >
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <p className="text-slate-500 text-xs mt-3">
                        No spam, ever. We respect your privacy. 🔒
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      className="flex flex-col items-start gap-3"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                        <CheckCircle className="w-7 h-7 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-lg font-sora">You're in! 🎉</p>
                        <p className="text-slate-300 text-sm mt-1">
                          Check your inbox for your exclusive discount code.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ContactForm
