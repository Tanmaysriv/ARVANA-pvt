import { useState } from 'react'
import { Menu, X, Sparkles, ArrowRight } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass-effect shadow-lg backdrop-blur-xl border-b border-white/20">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <Sparkles className="w-9 h-9 text-sky-600 animate-pulse-slow" />
              <div className="absolute inset-0 bg-sky-400 blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            </div>
            <span className="text-3xl font-bold gradient-text hover:scale-105 transition-transform cursor-pointer">
              ARVANA
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="relative text-slate-700 hover:text-sky-600 transition-all font-medium group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#solutions" className="relative text-slate-700 hover:text-sky-600 transition-all font-medium group">
              Solutions
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#catalog" className="relative text-slate-700 hover:text-sky-600 transition-all font-medium group">
              Categories
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#contact" className="relative text-slate-700 hover:text-sky-600 transition-all font-medium group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a 
              href="#contact"
              className="flex items-center space-x-2 btn-primary group"
            >
              <span>Request Demo</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 animate-fade-in">
            <a href="#home" className="block text-slate-700 hover:text-sky-600 transition-colors font-medium">
              Home
            </a>
            <a href="#solutions" className="block text-slate-700 hover:text-sky-600 transition-colors font-medium">
              Solutions
            </a>
            <a href="#catalog" className="block text-slate-700 hover:text-sky-600 transition-colors font-medium">
              Categories
            </a>
            <a href="#contact" className="block text-slate-700 hover:text-sky-600 transition-colors font-medium">
              Contact
            </a>
            <a 
              href="#contact"
              className="w-full flex items-center justify-center space-x-2 btn-primary"
            >
              <span>Request Demo</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
