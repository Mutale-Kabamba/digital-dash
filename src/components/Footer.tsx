import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-16 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Digital Dash</h3>
            <p className="text-blue-200 mb-4">
              Streamlining digital processes with modern, efficient tools for everyday tasks.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-white transition-colors duration-200">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-white transition-colors duration-200">
                <i className="fab fa-github text-xl"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-white transition-colors duration-200">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/home" className="footer-link text-blue-200 hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dash" className="footer-link text-blue-200 hover:text-white transition-colors duration-200">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/sme" className="footer-link text-blue-200 hover:text-white transition-colors duration-200">
                  Business Tools
                </Link>
              </li>
              <li>
                <Link to="/returns" className="footer-link text-blue-200 hover:text-white transition-colors duration-200">
                  Compliance Tools
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Tools */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Tools</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/tools/napsa" className="footer-link text-blue-200 hover:text-white transition-colors duration-200">
                  NAPSA Generator
                </Link>
              </li>
              <li>
                <Link to="/tools/nhima" className="footer-link text-blue-200 hover:text-white transition-colors duration-200">
                  NHIMA Generator
                </Link>
              </li>
              <li>
                <Link to="/tools/invoice" className="footer-link text-blue-200 hover:text-white transition-colors duration-200">
                  Invoice Generator
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-blue-200">
              <li className="flex items-center">
                <i className="fa-solid fa-envelope mr-2"></i>
                <span>info@digitaldash.com</span>
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-phone mr-2"></i>
                <span>+260 123 456 789</span>
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-location-dot mr-2"></i>
                <span>Lusaka, Zambia</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-blue-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-200 text-sm">
            © 2025 Digital Dash. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privacy" className="text-blue-200 hover:text-white text-sm transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="/terms" className="text-blue-200 hover:text-white text-sm transition-colors duration-200">
              Terms of Service
            </a>
            <a href="/support" className="text-blue-200 hover:text-white text-sm transition-colors duration-200">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;