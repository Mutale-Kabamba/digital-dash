// Home page JavaScript

// Suggest a tool handler
function suggestTool() {
  const input = document.getElementById('suggest-tool');
  const msg = document.getElementById('suggest-msg');
  if (input.value.trim().length < 3) {
    msg.style.color = "#ff8800";
    msg.textContent = "Please enter a tool name.";
    return;
  }
  msg.style.color = "#2ecc40";
  msg.textContent = "Thank you for your suggestion!";
  input.value = "";
  setTimeout(() => { msg.textContent = ""; }, 4000);
}

// Newsletter subscription handler
function subscribeNewsletter() {
  const input = document.getElementById('newsletter-email');
  const email = input.value.trim();
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    alert("Please enter your email address.");
    return;
  }
  
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }
  
  // Simulate newsletter subscription
  alert("Thank you for subscribing to our newsletter!");
  input.value = "";
}

// Mobile menu toggle handler
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  const toggle = document.querySelector('.mobile-menu-toggle');
  
  if (mobileMenu.classList.contains('active')) {
    mobileMenu.classList.remove('active');
    toggle.classList.remove('active');
  } else {
    mobileMenu.classList.add('active');
    toggle.classList.add('active');
  }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
  const navbar = document.querySelector('.navbar');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (!navbar.contains(event.target) && mobileMenu.classList.contains('active')) {
    mobileMenu.classList.remove('active');
    document.querySelector('.mobile-menu-toggle').classList.remove('active');
  }
});

// Event listener for DOM ready
document.addEventListener('DOMContentLoaded', function() {
  // Add scroll effect to navbar
  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const links = document.querySelectorAll('.navbar-links a');
    const suggestButton = document.querySelector('.navbar-suggest');

    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(0, 0, 0, 0.8)';
      navbar.style.color = '#ffffff';
      links.forEach(link => {
        link.style.color = '#ffffff';
      });
      suggestButton.style.background = 'rgba(46, 204, 64, 0.8)';
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.1)';
      navbar.style.color = '#2c2c2c';
      links.forEach(link => {
        link.style.color = '#2c2c2c';
      });
      suggestButton.style.background = 'linear-gradient(135deg, #2ecc40 0%, #17a2b8 100%)';
    }
  });
});