import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  useEffect(() => {
    // Stats counter animation
    const animateCounter = (element: HTMLElement, target: number, duration = 2000) => {
      let start = 0;
      const increment = target / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          element.textContent = target.toString();
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(start).toString();
        }
      }, 16);
    };

    // Initialize counters when they come into view
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target as HTMLElement;
          const target = parseInt(counter.getAttribute('data-target') || '0');
          animateCounter(counter, target);
          observer.unobserve(counter);
        }
      });
    }, observerOptions);

    // Start observing when DOM is loaded
    document.querySelectorAll('.stat-counter').forEach(counter => {
      observer.observe(counter);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20 lg:py-32 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full"></div>
          <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-white rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="float-animation flex justify-center mb-8">
              <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center glassmorphism">
                <i className="fa-solid fa-rocket text-4xl"></i>
              </div>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Digital <span className="text-yellow-300">Dash</span>
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Modern tools for digital life. Streamline your workflow with powerful, intuitive applications designed for today's challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/dash" 
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-200 inline-flex items-center gap-2 shadow-lg"
              >
                <i className="fa-solid fa-play"></i>
                Get Started
              </Link>
              <Link 
                to="/returns" 
                className="bg-blue-700/50 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700/70 transition-all duration-200 inline-flex items-center gap-2 glassmorphism"
              >
                <i className="fa-solid fa-file-lines"></i>
                Compliance Tools
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                <span className="stat-counter" data-target="10">0</span>+
              </div>
              <p className="text-gray-600 font-medium">Digital Tools</p>
              <p className="text-sm text-gray-500 mt-2">Powerful applications for every need</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                <span className="stat-counter" data-target="99">0</span>%
              </div>
              <p className="text-gray-600 font-medium">User Satisfaction</p>
              <p className="text-sm text-gray-500 mt-2">Built with user experience in mind</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-green-600 mb-2">
                <span className="stat-counter" data-target="24">0</span>/7
              </div>
              <p className="text-gray-600 font-medium">Available</p>
              <p className="text-sm text-gray-500 mt-2">Access your tools anytime, anywhere</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">
              Featured Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most popular tools designed to boost your productivity and simplify complex tasks.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* NAPSA Tool */}
            <div className="tool-card bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <i className="fa-solid fa-file-invoice-dollar text-blue-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">NAPSA Generator</h3>
              <p className="text-gray-600 text-sm mb-4">Generate NAPSA employee contribution files with ease.</p>
              <Link 
                to="/tools/napsa" 
                className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200 inline-flex items-center gap-1"
              >
                Try it now <i className="fa-solid fa-arrow-right text-xs"></i>
              </Link>
            </div>
            
            {/* NHIMA Tool */}
            <div className="tool-card bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <i className="fa-solid fa-file-medical text-green-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">NHIMA Generator</h3>
              <p className="text-gray-600 text-sm mb-4">Create NHIMA employee data files quickly and accurately.</p>
              <Link 
                to="/tools/nhima" 
                className="text-green-600 font-medium hover:text-green-700 transition-colors duration-200 inline-flex items-center gap-1"
              >
                Try it now <i className="fa-solid fa-arrow-right text-xs"></i>
              </Link>
            </div>
            
            {/* Dashboard Tool */}
            <div className="tool-card bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <i className="fa-solid fa-chart-line text-purple-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Dashboard</h3>
              <p className="text-gray-600 text-sm mb-4">Access all your tools from one central location.</p>
              <Link 
                to="/dash" 
                className="text-purple-600 font-medium hover:text-purple-700 transition-colors duration-200 inline-flex items-center gap-1"
              >
                View all <i className="fa-solid fa-arrow-right text-xs"></i>
              </Link>
            </div>
            
            {/* More Tools */}
            <div className="tool-card bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-gray-300 rounded-xl flex items-center justify-center mb-4">
                <i className="fa-solid fa-plus text-gray-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">More Coming Soon</h3>
              <p className="text-gray-600 text-sm mb-4">We're constantly adding new tools to help you work smarter.</p>
              <span className="text-gray-500 font-medium">Stay tuned</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-4xl font-bold text-gray-900 mb-6">
                Why Choose Digital Dash?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                    <i className="fa-solid fa-bolt text-blue-600"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Lightning Fast</h3>
                    <p className="text-gray-600">Built with modern web technologies for instant responsiveness and smooth user experience.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mt-1">
                    <i className="fa-solid fa-shield-halved text-green-600"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Secure & Private</h3>
                    <p className="text-gray-600">Your data stays on your device. We don't store or track your personal information.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mt-1">
                    <i className="fa-solid fa-mobile-screen text-purple-600"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Mobile Friendly</h3>
                    <p className="text-gray-600">Works perfectly on all devices - desktop, tablet, or mobile phone.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl p-8 text-white text-center">
                <i className="fa-solid fa-laptop-code text-6xl mb-6 opacity-90"></i>
                <h3 className="font-display text-2xl font-bold mb-4">Ready to Get Started?</h3>
                <p className="text-blue-100 mb-6">Join thousands of users who trust Digital Dash for their daily workflows.</p>
                <Link 
                  to="/dash" 
                  className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-200 inline-flex items-center gap-2"
                >
                  <i className="fa-solid fa-rocket"></i>
                  Launch Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;