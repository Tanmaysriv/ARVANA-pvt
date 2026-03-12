import { Sparkles, Mail, MapPin, Phone } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-slate-900 dark:bg-black text-slate-300 dark:text-slate-400 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-8 h-8 text-primary-400" />
              <span className="text-2xl font-bold text-white">ARVANA</span>
            </div>
            <p className="text-sm leading-relaxed">
              Shop smarter with AR virtual try-on. See how products look on you before you buy. Free shipping on orders over ₹999.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="hover:text-primary-400 transition-colors">Home</a></li>
              <li><a href="#catalog" className="hover:text-primary-400 transition-colors">Shop</a></li>
              <li><a href="#deals" className="hover:text-primary-400 transition-colors">Deals</a></li>
              <li><a href="#contact" className="hover:text-primary-400 transition-colors">Help & Support</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><a href="/category/shoes" className="hover:text-primary-400 transition-colors">Shoes</a></li>
              <li><a href="/category/bags" className="hover:text-primary-400 transition-colors">Bags</a></li>
              <li><a href="/category/clothes" className="hover:text-primary-400 transition-colors">Clothes</a></li>
              <li><a href="/category/watches" className="hover:text-primary-400 transition-colors">Watches</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm">support@arvana.in</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+91 95067 20216</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-sm">
          <p>&copy; 2026 ARVANA. All rights reserved. | Privacy Policy | Terms of Service | Shipping & Returns</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
