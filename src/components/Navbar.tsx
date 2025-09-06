import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path === '/home' && location.pathname === '/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 glassmorphism border-b border-gray-200/50 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/home" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-bolt text-white text-sm"></i>
              </div>
              <span className="font-display font-bold text-xl text-gray-900">Digital Dash</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/home" 
              className={`nav-link transition-colors duration-200 font-medium ${
                isActive('/home') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/dash" 
              className={`nav-link transition-colors duration-200 font-medium ${
                isActive('/dash') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Tools
            </Link>
            <Link 
              to="/sme" 
              className={`nav-link transition-colors duration-200 font-medium ${
                isActive('/sme') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Business Tools
            </Link>
            <Link 
              to="/returns" 
              className={`nav-link transition-colors duration-200 font-medium ${
                isActive('/returns') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Compliance
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu} 
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <i className="fa-solid fa-bars text-xl"></i>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white/95 glassmorphism border-t border-gray-200/50`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/home" 
              className={`mobile-nav-link block px-3 py-2 font-medium ${
                isActive('/home') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/dash" 
              className={`mobile-nav-link block px-3 py-2 font-medium ${
                isActive('/dash') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tools
            </Link>
            <Link 
              to="/sme" 
              className={`mobile-nav-link block px-3 py-2 font-medium ${
                isActive('/sme') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Business Tools
            </Link>
            <Link 
              to="/returns" 
              className={`mobile-nav-link block px-3 py-2 font-medium ${
                isActive('/returns') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Compliance
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;