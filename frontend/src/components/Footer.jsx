import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Mail, MapPin, Phone, Instagram, Twitter, Youtube, ArrowUpRight } from 'lucide-react'

const QUICK_LINKS = [
  { label: 'Home',         href: '/'          },
  { label: 'Shop',         href: '#catalog'   },
  { label: 'New Arrivals', href: '#catalog'   },
  { label: 'Help & Support', href: '#contact' },
]

const CATEGORIES = [
  { label: 'Shoes',   href: '/category/shoes'   },
  { label: 'Bags',    href: '/category/bags'    },
  { label: 'Clothes', href: '/category/clothes' },
  { label: 'Watches', href: '/category/watches' },
]

const SOCIALS = [
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: Twitter,   href: '#', label: 'Twitter'   },
  { Icon: Youtube,   href: '#', label: 'YouTube'   },
]

const Footer = () => {
  return (
    <footer className="relative bg-obsidian-950 text-slate-400 overflow-hidden">
      {/* Noise texture */}
      <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml,%3Csvg viewBox%3D%220 0 256 256%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter id%3D%22n%22%3E%3CfeTurbulence type%3D%22fractalNoise%22 baseFrequency%3D%220.9%22 numOctaves%3D%224%22 stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect width%3D%22100%25%22 height%3D%22100%25%22 filter%3D%22url%28%23n%29%22 opacity%3D%220.04%22%2F%3E%3C%2Fsvg%3E')] pointer-events-none" />

      {/* Top glow bar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        {/* ── Main Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-16 border-b border-white/5">

          {/* Brand */}
          <motion.div 
            className="col-span-2 md:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div whileHover={{ x: 4 }}>
              <Link to="/" className="flex items-center gap-3 mb-5 group w-fit">
                <motion.div 
                  className="relative"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-8 h-8 text-primary-400 group-hover:text-primary-300 transition-colors drop-shadow-lg" />
                  <motion.div 
                    className="absolute inset-0 bg-primary-500 blur-xl opacity-30 group-hover:opacity-60 transition-opacity"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </motion.div>
                <motion.span 
                  className="text-2xl font-bold font-sora text-white"
                  whileHover={{ skewY: 2 }}
                >
                  ARVANA
                </motion.span>
              </Link>
            </motion.div>
            <motion.p 
              className="text-sm leading-relaxed text-slate-500 mb-6 max-w-[220px]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Shop smarter with AR virtual try-on. See how products look on you — before you buy.
            </motion.p>

            {/* Social icons */}
            <div className="flex gap-3">
              {SOCIALS.map(({ Icon, href, label }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.2, y: -4 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/[0.12] flex items-center justify-center
                             text-slate-400 hover:text-white hover:bg-primary-500/30 hover:border-primary-500/50
                             transition-all duration-300 shadow-lg"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-white font-semibold font-sora text-sm uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map(({ label, href }, i) => (
                <motion.li 
                  key={label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                >
                  <motion.a
                    href={href}
                    whileHover={{ x: 4 }}
                    className="text-sm text-slate-500 hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                  >
                    {label}
                    <motion.span 
                      className="opacity-0 group-hover:opacity-100"
                      initial={{ translateY: 0, translateX: 0 }}
                      whileHover={{ translateX: 2, translateY: -2 }}
                    >
                      <ArrowUpRight className="w-3 h-3" />
                    </motion.span>
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold font-sora text-sm uppercase tracking-wider mb-5">Categories</h4>
            <ul className="space-y-3">
              {CATEGORIES.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-sm text-slate-500 hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                  >
                    {label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold font-sora text-sm uppercase tracking-wider mb-5">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:support@arvana.in" className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/20 transition-colors">
                    <Mail className="w-4 h-4 text-slate-400 group-hover:text-primary-400 transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-0.5">Email</p>
                    <p className="text-sm text-slate-400 group-hover:text-white transition-colors">support@arvana.in</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="tel:+919506720216" className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/20 transition-colors">
                    <Phone className="w-4 h-4 text-slate-400 group-hover:text-primary-400 transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-0.5">Phone</p>
                    <p className="text-sm text-slate-400 group-hover:text-white transition-colors">+91 95067 20216</p>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-0.5">Location</p>
                  <p className="text-sm text-slate-400">Mumbai, India</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6 text-xs text-slate-600">
          <p>© 2026 ARVANA. All rights reserved.</p>
          <div className="flex gap-4">
            {['Privacy Policy', 'Terms of Service', 'Shipping & Returns'].map(t => (
              <a key={t} href="#" className="hover:text-slate-400 transition-colors">{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
