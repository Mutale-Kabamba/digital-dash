/**
 * Digital Dash Layout Manager
 * Dynamically loads navbar and footer components into pages
 */

class LayoutManager {
    constructor() {
        this.components = {
            navbar: 'components/navbar.html',
            footer: 'components/footer.html'
        };
        
        this.currentPage = this.getCurrentPage();
        this.init();
    }
    
    /**
     * Initialize the layout manager
     */
    init() {
        console.log('Digital Dash Layout Manager initialized');
        console.log('Current URL:', window.location.href);
        console.log('Protocol:', window.location.protocol);
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.loadComponents();
            });
        } else {
            this.loadComponents();
        }
    }
    
    /**
     * Get current page name from URL
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().split('.')[0];
        
        // Handle special cases
        if (filename === 'index' || filename === '') {
            return 'home';
        }
        
        // Handle tools pages
        if (path.includes('/tools/')) {
            const toolName = filename;
            // Map tool names to their parent categories
            if (toolName === 'napsa' || toolName === 'nhima') {
                return 'returns'; // Compliance tools
            } else if (toolName === 'invoice') {
                return 'sme'; // Business tools
            }
        }
        
        return filename;
    }
    
    /**
     * Determine the correct base path for components
     */
    getBasePath() {
        const path = window.location.pathname;
        // If we're in a subdirectory (like tools/), we need to go up one level
        if (path.includes('/tools/')) {
            return '../components/';
        }
        return 'components/';
    }
    
    /**
     * Load all components
     */
    async loadComponents() {
        const basePath = this.getBasePath();
        
        try {
            await Promise.all([
                this.loadComponent('navbar', basePath + 'navbar.html'),
                this.loadComponent('footer', basePath + 'footer.html')
            ]);
            
            // Update navigation active states after components are loaded
            this.updateActiveNavigation();
            
            // Initialize mobile menu functionality
            this.initializeMobileMenu();
            
        } catch (error) {
            console.error('Failed to load layout components:', error);
        }
    }
    
    /**
     * Load a specific component using XMLHttpRequest as fallback for file:// protocol
     */
    async loadComponent(componentName, componentPath) {
        const targetElement = document.getElementById(componentName);
        
        if (!targetElement) {
            console.warn(`No element found with id="${componentName}"`);
            return;
        }
        
        console.log(`Attempting to load ${componentName} from: ${componentPath}`);
        
        try {
            // Try fetch first
            if (window.location.protocol !== 'file:') {
                const response = await fetch(componentPath);
                
                console.log(`Response status for ${componentName}:`, response.status);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const html = await response.text();
                targetElement.innerHTML = html;
                
                console.log(`✓ Loaded ${componentName} component successfully`);
                return;
            }
            
            // Fallback for file:// protocol using XMLHttpRequest
            await this.loadComponentXHR(componentName, componentPath, targetElement);
            
        } catch (error) {
            console.error(`Failed to load ${componentName}:`, error);
            console.error(`Component path was: ${componentPath}`);
            console.error(`Current location: ${window.location.href}`);
            
            // Provide fallback content instead of just error message
            this.provideFallbackContent(componentName, targetElement);
        }
    }
    
    /**
     * Load component using XMLHttpRequest for file:// protocol compatibility
     */
    loadComponentXHR(componentName, componentPath, targetElement) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', componentPath, true);
            
            xhr.onload = function() {
                if (xhr.status === 200 || xhr.status === 0) { // status 0 for file:// protocol
                    targetElement.innerHTML = xhr.responseText;
                    console.log(`✓ Loaded ${componentName} component successfully via XHR`);
                    resolve();
                } else {
                    reject(new Error(`XHR failed with status: ${xhr.status}`));
                }
            };
            
            xhr.onerror = function() {
                reject(new Error('XHR request failed'));
            };
            
            xhr.send();
        });
    }
    
    /**
     * Provide fallback content when component loading fails
     */
    provideFallbackContent(componentName, targetElement) {
        if (componentName === 'navbar') {
            targetElement.innerHTML = this.getFallbackNavbar();
        } else if (componentName === 'footer') {
            targetElement.innerHTML = this.getFallbackFooter();
        } else {
            targetElement.innerHTML = `<p style="color: red; padding: 1rem;">Failed to load ${componentName}</p>`;
        }
    }
    
    /**
     * Update active navigation states based on current page
     */
    updateActiveNavigation() {
        // Update desktop navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === this.currentPage) {
                link.classList.remove('text-gray-600', 'font-medium');
                link.classList.add('text-blue-600', 'font-semibold');
            }
        });
        
        // Update mobile navigation
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === this.currentPage) {
                link.classList.remove('text-gray-600', 'font-medium');
                link.classList.add('text-blue-600', 'font-semibold');
            }
        });
        
        // Update logo link for subdirectories
        const logoLink = document.getElementById('logo-link');
        if (logoLink && window.location.pathname.includes('/tools/')) {
            logoLink.href = '../home.html';
        }
        
        // Update footer links for subdirectories
        if (window.location.pathname.includes('/tools/')) {
            this.updateFooterLinksForSubdirectory();
        }
    }
    
    /**
     * Update footer links when in subdirectory
     */
    updateFooterLinksForSubdirectory() {
        const footerLinks = document.querySelectorAll('.footer-link');
        footerLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Skip if already relative or external
            if (href.startsWith('../') || href.startsWith('http') || href.startsWith('#')) {
                return;
            }
            
            // Update relative paths for subdirectory
            if (href.startsWith('tools/')) {
                // Remove 'tools/' prefix since we're already in tools directory
                link.href = href.replace('tools/', '');
            } else if (!href.includes('/')) {
                // Add '../' prefix for main directory files
                link.href = '../' + href;
            }
        });
    }
    
    /**
     * Initialize mobile menu functionality
     */
    initializeMobileMenu() {
        // Ensure toggleMobileMenu function is available globally
        if (typeof window.toggleMobileMenu === 'undefined') {
            window.toggleMobileMenu = () => {
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) {
                    mobileMenu.classList.toggle('hidden');
                }
            };
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (event) => {
            const navbar = document.querySelector('nav');
            const mobileMenu = document.getElementById('mobile-menu');
            
            if (navbar && mobileMenu && !navbar.contains(event.target) && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
        
        // Close mobile menu when clicking on a link
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                }
            });
        });
    }
    
    /**
     * Get fallback navbar content
     */
    getFallbackNavbar() {
        const isInToolsDir = window.location.pathname.includes('/tools/');
        const pathPrefix = isInToolsDir ? '../' : '';
        
        return `
            <nav class="fixed top-0 left-0 right-0 bg-white/90 glassmorphism border-b border-gray-200/50 z-50 transition-all duration-300">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-16">
                        <div class="flex items-center">
                            <a href="${pathPrefix}home.html" class="flex items-center space-x-2" id="logo-link">
                                <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <i class="fa-solid fa-bolt text-white text-sm"></i>
                                </div>
                                <span class="font-display font-bold text-xl text-gray-900">Digital Dash</span>
                            </a>
                        </div>
                        <div class="hidden md:flex items-center space-x-8">
                            <a href="${pathPrefix}home.html" class="nav-link text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium" data-page="home">Home</a>
                            <a href="${pathPrefix}dash.html" class="nav-link text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium" data-page="dash">Tools</a>
                            <a href="${pathPrefix}sme.html" class="nav-link text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium" data-page="sme">Business Tools</a>
                            <a href="${pathPrefix}returns.html" class="nav-link text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium" data-page="returns">Compliance</a>
                        </div>
                        <div class="md:hidden">
                            <button onclick="toggleMobileMenu()" class="text-gray-600 hover:text-gray-900 focus:outline-none">
                                <i class="fa-solid fa-bars text-xl"></i>
                            </button>
                        </div>
                    </div>
                    <div id="mobile-menu" class="hidden md:hidden bg-white/95 glassmorphism border-t border-gray-200/50">
                        <div class="px-2 pt-2 pb-3 space-y-1">
                            <a href="${pathPrefix}home.html" class="mobile-nav-link block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium" data-page="home">Home</a>
                            <a href="${pathPrefix}dash.html" class="mobile-nav-link block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium" data-page="dash">Tools</a>
                            <a href="${pathPrefix}sme.html" class="mobile-nav-link block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium" data-page="sme">Business Tools</a>
                            <a href="${pathPrefix}returns.html" class="mobile-nav-link block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium" data-page="returns">Compliance</a>
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }
    
    /**
     * Get fallback footer content
     */
    getFallbackFooter() {
        const isInToolsDir = window.location.pathname.includes('/tools/');
        const pathPrefix = isInToolsDir ? '../' : '';
        
        return `
            <footer class="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-16 mt-20">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div>
                            <h3 class="text-xl font-bold mb-4">Digital Dash</h3>
                            <p class="text-blue-200 mb-4">
                                Empowering Zambian businesses with smart, simple tools for everyday success.
                            </p>
                            <div class="flex space-x-4">
                                <a href="#" class="text-blue-300 hover:text-white transition-colors duration-200">
                                    <i class="fab fa-twitter text-xl"></i>
                                </a>
                                <a href="#" class="text-blue-300 hover:text-white transition-colors duration-200">
                                    <i class="fab fa-github text-xl"></i>
                                </a>
                                <a href="#" class="text-blue-300 hover:text-white transition-colors duration-200">
                                    <i class="fab fa-linkedin text-xl"></i>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
                            <ul class="space-y-2">
                                <li><a href="${pathPrefix}home.html" class="footer-link text-blue-200 hover:text-white transition-colors duration-200">Home</a></li>
                                <li><a href="${pathPrefix}dash.html" class="footer-link text-blue-200 hover:text-white transition-colors duration-200">Tools Directory</a></li>
                                <li><a href="${pathPrefix}returns.html" class="footer-link text-blue-200 hover:text-white transition-colors duration-200">Compliance</a></li>
                                <li><a href="${pathPrefix}sme.html" class="footer-link text-blue-200 hover:text-white transition-colors duration-200">Business Tools</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="text-lg font-semibold mb-4">Business Tools</h4>
                            <ul class="space-y-2">
                                <li><a href="${pathPrefix}tools/invoice.html" class="footer-link text-blue-200 hover:text-white transition-colors duration-200">Invoice Generator</a></li>
                                <li><a href="${pathPrefix}tools/napsa.html" class="footer-link text-blue-200 hover:text-white transition-colors duration-200">NAPSA Generator</a></li>
                                <li><a href="${pathPrefix}tools/nhima.html" class="footer-link text-blue-200 hover:text-white transition-colors duration-200">NHIMA Generator</a></li>
                                <li><a href="#" class="text-blue-300">More Tools (Soon)</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="text-lg font-semibold mb-4">Contact</h4>
                            <ul class="space-y-2 text-blue-200">
                                <li class="flex items-center">
                                    <i class="fa-solid fa-envelope mr-2"></i>
                                    <span>business@digitaldash.com</span>
                                </li>
                                <li class="flex items-center">
                                    <i class="fa-solid fa-phone mr-2"></i>
                                    <span>+260 123 456 789</span>
                                </li>
                                <li class="flex items-center">
                                    <i class="fa-solid fa-location-dot mr-2"></i>
                                    <span>Lusaka, Zambia</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="border-t border-blue-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p class="text-blue-200 text-sm">
                            © 2025 Digital Dash. All rights reserved.
                        </p>
                        <div class="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" class="text-blue-200 hover:text-white text-sm transition-colors duration-200">Privacy Policy</a>
                            <a href="#" class="text-blue-200 hover:text-white text-sm transition-colors duration-200">Terms of Service</a>
                            <a href="#" class="text-blue-200 hover:text-white text-sm transition-colors duration-200">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }
}

// Global mobile menu toggle function
window.toggleMobileMenu = function() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
};

// Initialize layout manager when script loads
new LayoutManager();
