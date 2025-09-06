/**
 * Test script for the modular layout system
 * Run this in the browser console to test component loading
 */

console.log('🚀 Testing Digital Dash Modular Layout System');

// Test 1: Check if layout manager exists
console.log('\n📋 Test 1: Layout Manager Initialization');
if (typeof LayoutManager !== 'undefined') {
    console.log('✅ LayoutManager class is available');
} else {
    console.log('❌ LayoutManager class not found');
}

// Test 2: Check if containers exist
console.log('\n📋 Test 2: Container Elements');
const navbar = document.getElementById('navbar');
const footer = document.getElementById('footer');

if (navbar) {
    console.log('✅ Navbar container found');
    console.log(`   Content loaded: ${navbar.innerHTML.length > 0 ? 'Yes' : 'No'}`);
} else {
    console.log('❌ Navbar container missing');
}

if (footer) {
    console.log('✅ Footer container found');
    console.log(`   Content loaded: ${footer.innerHTML.length > 0 ? 'Yes' : 'No'}`);
} else {
    console.log('❌ Footer container missing');
}

// Test 3: Check navigation links
console.log('\n📋 Test 3: Navigation Links');
const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
if (navLinks.length > 0) {
    console.log(`✅ Found ${navLinks.length} navigation links`);
    
    // Check for active states
    const activeLinks = document.querySelectorAll('.nav-link.text-blue-600, .mobile-nav-link.text-blue-600');
    console.log(`   Active links: ${activeLinks.length}`);
    
    activeLinks.forEach(link => {
        console.log(`   Active: ${link.textContent.trim()}`);
    });
} else {
    console.log('❌ No navigation links found');
}

// Test 4: Check mobile menu functionality
console.log('\n📋 Test 4: Mobile Menu');
if (typeof toggleMobileMenu === 'function') {
    console.log('✅ Mobile menu toggle function available');
} else {
    console.log('❌ Mobile menu toggle function missing');
}

// Test 5: Check current page detection
console.log('\n📋 Test 5: Page Detection');
const currentPath = window.location.pathname;
const filename = currentPath.split('/').pop().split('.')[0];
console.log(`   Current path: ${currentPath}`);
console.log(`   Detected filename: ${filename}`);

// Test 6: Component file accessibility (only if not in subdirectory)
console.log('\n📋 Test 6: Component Files');
if (!currentPath.includes('/tools/')) {
    fetch('components/navbar.html')
        .then(response => {
            if (response.ok) {
                console.log('✅ navbar.html accessible');
            } else {
                console.log('❌ navbar.html not accessible');
            }
        })
        .catch(() => console.log('❌ navbar.html fetch failed'));
    
    fetch('components/footer.html')
        .then(response => {
            if (response.ok) {
                console.log('✅ footer.html accessible');
            } else {
                console.log('❌ footer.html not accessible');
            }
        })
        .catch(() => console.log('❌ footer.html fetch failed'));
} else {
    console.log('   Skipping component file test (in subdirectory)');
}

// Test 7: Link validation
console.log('\n📋 Test 7: Link Validation');
const allLinks = document.querySelectorAll('a[href]');
let internalLinks = 0;
let externalLinks = 0;
let hashLinks = 0;

allLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
        hashLinks++;
    } else if (href.startsWith('http')) {
        externalLinks++;
    } else {
        internalLinks++;
    }
});

console.log(`   Internal links: ${internalLinks}`);
console.log(`   External links: ${externalLinks}`);
console.log(`   Hash links: ${hashLinks}`);

console.log('\n🎉 Test completed! Check above for any issues.');

// Helper function to manually test mobile menu
window.testMobileMenu = function() {
    console.log('Testing mobile menu toggle...');
    if (typeof toggleMobileMenu === 'function') {
        toggleMobileMenu();
        console.log('Mobile menu toggled');
    } else {
        console.log('Mobile menu function not available');
    }
};

console.log('\n💡 Tip: Run testMobileMenu() to test mobile menu functionality');
