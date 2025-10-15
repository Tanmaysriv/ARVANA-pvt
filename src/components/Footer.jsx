import { Sparkles, Mail, MapPin, Phone } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-8 h-8 text-primary-400" />
              <span className="text-2xl font-bold text-white">ARVANA</span>
            </div>
            <p className="text-sm leading-relaxed">
              Revolutionary AR virtual try-on platform for fashion products. Try before you buy.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="hover:text-primary-400 transition-colors">Home</a></li>
              <li><a href="#catalog" className="hover:text-primary-400 transition-colors">Products</a></li>
              <li><a href="#solutions" className="hover:text-primary-400 transition-colors">Solutions</a></li>
              <li><a href="#contact" className="hover:text-primary-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><a href="#catalog" className="hover:text-primary-400 transition-colors">Shoes</a></li>
              <li><a href="#catalog" className="hover:text-primary-400 transition-colors">Bags</a></li>
              <li><a href="#catalog" className="hover:text-primary-400 transition-colors">Clothes</a></li>
              <li><a href="#catalog" className="hover:text-primary-400 transition-colors">Watches</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm">support@arvana.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; 2024 ARVANA. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
