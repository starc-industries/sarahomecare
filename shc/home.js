// Global Variables
let currentSlide = 0;
let heroImages = [];
let slideInterval;
let isLoading = true;

// Background Images from provided URLs
const backgroundImages = [
    'https://pixabay.com/get/g502bf175fd49f55ba3e57c55a284aa772e2bc448c90afffa02eae0bfc6ab3b5449fb8bec16e377ff1d26e72b7074b2861c3870e985843b85ede8d29f5fb881f8_1280.jpg',
    'https://pixabay.com/get/g502bf175fd49f55ba3e57c55a284aa772e2bc448c90afffa02eae0bfc6ab3b5449fb8bec16e377ff1d26e72b7074b2861c3870e985843b85ede8d29f5fb881f8_1280.jpg',
    'https://pixabay.com/get/ge7b4485144b2e4621794af9301edf9d7a3a905a93184dbb122320684dc00306f430ef80cf1387325796c12d672cf3ba41c732d57540f45265fc566d9b23648a5_1280.jpg',
    'https://pixabay.com/get/gb2e7b75160dc63932c3f203b533517b2e73779d858561502b4fda6617cc468ba01376e01e650cdb49b0d1197e218e9a05c8c6637e8a32ab2bfbeea723fad6889_1280.jpg',
    'https://pixabay.com/get/gf2e06bddb2e6b5b7268015f9030cbab244576a0510c489a7fac951da4cbbb5c694734e12f3c8246843949a07df43943dbbdef9c6610a4e00a9c0af6cdf965097_1280.jpg',
    'https://pixabay.com/get/g1a5221ae3fe7f9e9ee28d3960f1a1596f2de2c8b1d94172ef7a9a6ded5fc254c94294569ec5f94239ed838526e1344de9133ef5e89c7630b4b4af978602e8b85_1280.jpg',
    'https://pixabay.com/get/gd0554f94acbfa735ec8a0fb515abc1df111c4c36410b8307fa813d26d6946e2887647a3c4e39517a60503919787bfa54991cf1e139f389acc70635f216a33110_1280.jpg',
    'https://pixabay.com/get/g51a132809da164fbfb8de7d74a1cedf076325af6cdd4cc65f2f9709dc377b6aa2b41af45ef8095702a586f13201cc0935e5c9055e1e58284db32d0ae9a1bf29c_1280.jpg',
    'https://pixabay.com/get/g4dec6eadfa2c10446a3260af3aecea9ba351d699cee460cdbe65721ed05c11add27b8ea948deeda899dbea192e75ad2f147c2fc9765a97ca2d0f03460598c7cf_1280.jpg',
    'https://pixabay.com/get/g0f7ba74d62e54e0ebb923d6ddcbef3bd553137f8a96a63f53d13deee3031c62ce101543383276de25497b168a13f251acd4ec7c9d8708b4f45ccde9464728c85_1280.jpg',
    'https://pixabay.com/get/g9fd0d84644cc61bb74a886eb658d4829f4bc0b1753b64adcf71e6f2a410184653d664e9842064a66f3acdeb21cca455ff8b64a51249f6993d58e4aa0fd058449_1280.jpg',
    'https://pixabay.com/get/g34a6e59eda2cb24fc035ee46c6c53d50d540634a6f9a8683524f7f8c0224ffc68dfba2b1e7c8eb6bd1cb44a57493f319e6d9da7af6d0e641bebf548a92344ede_1280.jpg',
    'https://pixabay.com/get/gb52e32b23f2c5522d37b342ced98f474ce369798c10541086b630f2dc036b9105417eecbe8ce83052d95981abc68f2e5788c56c9c967e1b1166aa3ea400dd0c4_1280.jpg',
    'https://pixabay.com/get/g2d21c9353f0f74eb1296d66a499d288c3ebc5d44006b264380cacc8a4d428d98a1529dc0f98455a1df258b317e69816ce3e3deee8791f103048649ea2bbb6892_1280.jpg'
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    setupNavigation();
    initializeHeroSlider();
    setupScrollAnimations();
    setupForms();
    setupCountingAnimation();
    setupSmoothScrolling();
    
    // Hide loading overlay after initialization
    setTimeout(() => {
        hideLoadingOverlay();
    }, 1500);
}

// Hide Loading Overlay
function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);
    }
}

// Navigation Setup
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
        }
    });
}

// Hero Slider Initialization
function initializeHeroSlider() {
    const heroSlider = document.querySelector('.hero-slider');
    const indicatorsContainer = document.querySelector('.slide-indicators');
    
    if (!heroSlider || !indicatorsContainer) return;

    // Create slides
    backgroundImages.forEach((imageUrl, index) => {
        const slide = document.createElement('div');
        slide.className = `hero-slide ${index === 0 ? 'active' : ''}`;
        slide.style.backgroundImage = `url(${imageUrl})`;
        heroSlider.appendChild(slide);

        // Create indicator
        const indicator = document.createElement('div');
        indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });

    heroImages = document.querySelectorAll('.hero-slide');
    
    // Start auto-slide
    startSlideShow();
}

// Start Slide Show
function startSlideShow() {
    slideInterval = setInterval(() => {
        nextSlide();
    }, 5000);
}

// Stop Slide Show
function stopSlideShow() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

// Next Slide
function nextSlide() {
    currentSlide = (currentSlide + 1) % heroImages.length;
    updateSlide();
}

// Previous Slide
function previousSlide() {
    currentSlide = (currentSlide - 1 + heroImages.length) % heroImages.length;
    updateSlide();
}

// Go to Specific Slide
function goToSlide(index) {
    currentSlide = index;
    updateSlide();
    
    // Restart auto-slide
    stopSlideShow();
    startSlideShow();
}

// Update Slide
function updateSlide() {
    // Update slides
    heroImages.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });

    // Update indicators
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

// Scroll Animations Setup
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Trigger counting animation for stat cards
                if (entry.target.classList.contains('stat-card')) {
                    const numberElement = entry.target.querySelector('.stat-number');
                    if (numberElement && !numberElement.classList.contains('counted')) {
                        animateCounter(numberElement);
                        numberElement.classList.add('counted');
                    }
                }
            }
        });
    }, observerOptions);

    // Observe elements with animation data attributes
    const animatedElements = document.querySelectorAll('[data-animation]');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Counter Animation
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const start = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(target * easeOutQuart);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Counting Animation Setup
function setupCountingAnimation() {
    // This is handled in setupScrollAnimations
}

// Smooth Scrolling Setup
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll to Section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Forms Setup
function setupForms() {
    setupContactForm();
    setupAppointmentForm();
    setupPortalForms();
}

// Contact Form Setup
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
}

// Handle Contact Form
async function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (validateContactForm(data)) {
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                showSuccessMessage('Thank you for your message! We will get back to you soon.');
                e.target.reset();
            } else {
                showErrorMessage(result.error || 'Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            showErrorMessage('Network error. Please check your connection and try again.');
        }
    }
}

// Validate Contact Form
function validateContactForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Please enter a valid name');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.subject) {
        errors.push('Please select a subject');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Please enter a message with at least 10 characters');
    }
    
    if (errors.length > 0) {
        showErrorMessage(errors.join('\n'));
        return false;
    }
    
    return true;
}

// Email Validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone Validation
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Appointment Form Setup
function setupAppointmentForm() {
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleAppointmentForm);
        
        // Set minimum date to today
        const dateInput = document.getElementById('appointmentDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }
    }
}

// Handle Appointment Form
async function handleAppointmentForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (validateAppointmentForm(data)) {
        try {
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                showSuccessMessage('Your appointment request has been submitted! We will contact you shortly to confirm.');
                closeAppointmentModal();
                e.target.reset();
            } else {
                showErrorMessage(result.error || 'Failed to book appointment. Please try again.');
            }
        } catch (error) {
            console.error('Appointment booking error:', error);
            showErrorMessage('Network error. Please check your connection and try again.');
        }
    }
}

// Validate Appointment Form
function validateAppointmentForm(data) {
    const errors = [];
    
    if (!data.patientName || data.patientName.trim().length < 2) {
        errors.push('Please enter a valid patient name');
    }
    
    if (!data.patientEmail || !isValidEmail(data.patientEmail)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.patientPhone || !isValidPhone(data.patientPhone)) {
        errors.push('Please enter a valid phone number');
    }
    
    if (!data.patientAge || data.patientAge < 1 || data.patientAge > 120) {
        errors.push('Please enter a valid age');
    }
    
    if (!data.department) {
        errors.push('Please select a department');
    }
    
    if (!data.appointmentDate) {
        errors.push('Please select an appointment date');
    }
    
    if (!data.appointmentTime) {
        errors.push('Please select an appointment time');
    }
    
    // Check if appointment date is not in the past
    const selectedDate = new Date(data.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        errors.push('Please select a future date for your appointment');
    }
    
    if (errors.length > 0) {
        showErrorMessage(errors.join('\n'));
        return false;
    }
    
    return true;
}

// Portal Forms Setup
function setupPortalForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        
        loginForm.addEventListener('submit', handleLoginForm);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterForm);
    }
}

/*/modified
function login()
{
    window.location.href = 'employee.html';
}*/

// Handle Login Form
async function handleLoginForm(e) {
    
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (validateLoginForm(data)) {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                // Store token and user data in localStorage
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                localStorage.setItem('permissions', JSON.stringify(result.permissions));
                
                showSuccessMessage(`Welcome back, ${result.user.firstName}! You are now logged in.`);
                closePortalModal();
                updateUIForLoggedInUser(result.user);
                
                // Redirect based on user role
                redirectBasedOnRole(result.user);
            } else {
                showErrorMessage(result.error || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            showErrorMessage('Network error. Please check your connection and try again.');
            window.location.href = 'admin.html';
        }
    }
}

// Validate Login Form
function validateLoginForm(data) {
    const errors = [];
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.password || data.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }
    
    if (errors.length > 0) {
        showErrorMessage(errors.join('\n'));
        return false;
    }
    
    return true;
}

// Handle Register Form
async function handleRegisterForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (validateRegisterForm(data)) {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                // Store token in localStorage
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                
                showSuccessMessage(`Welcome, ${result.user.firstName}! Your account has been created successfully.`);
                closePortalModal();
                updateUIForLoggedInUser(result.user);
            } else {
                showErrorMessage(result.error || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showErrorMessage('Network error. Please check your connection and try again.');
            window.location.href = 'employee.html';
        }
    }
}

// Validate Register Form
function validateRegisterForm(data) {
    const errors = [];
    
    if (!data.firstName || data.firstName.trim().length < 2) {
        errors.push('Please enter a valid first name');
    }
    
    if (!data.lastName || data.lastName.trim().length < 2) {
        errors.push('Please enter a valid last name');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.phone || !isValidPhone(data.phone)) {
        errors.push('Please enter a valid phone number');
    }
    
    if (!data.dateOfBirth) {
        errors.push('Please select your date of birth');
    }
    
    if (!data.password || data.password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    
    if (data.password !== data.confirmPassword) {
        errors.push('Passwords do not match');
    }
    
    if (!data.terms) {
        errors.push('Please agree to the Terms and Conditions');
    }
    
    if (errors.length > 0) {
        showErrorMessage(errors.join('\n'));
        return false;
    }
    
    return true;
}

// Modal Functions
function openAppointmentModal() {
    const modal = document.getElementById('appointmentModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeAppointmentModal() {
    const modal = document.getElementById('appointmentModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function openPortalModal() {
    const modal = document.getElementById('portalModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closePortalModal() {
    const modal = document.getElementById('portalModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Portal Tab Switching
function switchPortalTab(tabName) {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));
    
    const activeTab = document.querySelector(`[onclick="switchPortalTab('${tabName}')"]`);
    const activeContent = document.getElementById(`${tabName}Tab`);
    
    if (activeTab && activeContent) {
        activeTab.classList.add('active');
        activeContent.classList.add('active');
    }
}

// Message Functions
function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showMessage(message, type) {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        animation: slideInRight 0.3s ease-out;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
    `;
    
    messageEl.textContent = message;
    document.body.appendChild(messageEl);
    
    // Add slide-in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageEl.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 300);
    }, 5000);
}

// Event Listeners for Portal Link
document.addEventListener('DOMContentLoaded', function() {
    const portalLink = document.querySelector('a[href="#portal"]');
    if (portalLink) {
        portalLink.addEventListener('click', function(e) {
            
            e.preventDefault();
            openPortalModal();
        });
    }
});

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    const appointmentModal = document.getElementById('appointmentModal');
    const portalModal = document.getElementById('portalModal');
    
    if (e.target === appointmentModal) {
        closeAppointmentModal();
    }
    
    if (e.target === portalModal) {
        closePortalModal();
    }
});

// Keyboard navigation for accessibility
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeAppointmentModal();
        closePortalModal();
    }
});

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    const portalBtn = document.querySelector('.portal-btn');
    if (portalBtn) {
        portalBtn.textContent = `Welcome, ${user.firstName}`;
        portalBtn.style.background = 'var(--gradient-secondary)';
    }
}

// Check if user is logged in on page load
function checkUserAuth() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        try {
            const userData = JSON.parse(user);
            updateUIForLoggedInUser(userData);
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        }
    }
}

// Add logout functionality
function logoutUser() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    const portalBtn = document.querySelector('.portal-btn');
    if (portalBtn) {
        portalBtn.textContent = 'Patient Portal';
        portalBtn.style.background = 'var(--gradient-primary)';
    }
    
    showSuccessMessage('You have been logged out successfully.');
}

// Initialize auth check on page load
document.addEventListener('DOMContentLoaded', function() {
    checkUserAuth();
});

// Redirect based on user role
function redirectBasedOnRole(user) {
    setTimeout(() => {
        if (user.level === 1) {
            // Admin - redirect to admin dashboard
            window.location.href = '/admim.html';
        } else if (user.level === 2) {
            // Employee - redirect to employee dashboard
            window.location.href = '/employee.html';
        }
        // Patients stay on main page
    }, 2000);
}

// Service card interactions
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        const btn = card.querySelector('.service-btn');
        if (btn) {
            btn.addEventListener('click', function() {
                const serviceTitle = card.querySelector('.service-title').textContent;
                showSuccessMessage(`More information about ${serviceTitle} would be available on a detailed service page.`);
            });
        }
    });
});

// Staff contact button interactions
document.addEventListener('DOMContentLoaded', function() {
    const staffContactBtns = document.querySelectorAll('.staff-contact-btn');
    staffContactBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const staffCard = btn.closest('.staff-card');
            const staffName = staffCard.querySelector('.staff-name').textContent;
            showSuccessMessage(`Contact information for ${staffName} would be displayed in a contact modal.`);
        });
    });
});

// Performance optimization - Lazy loading for images
function setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading after DOM is loaded
document.addEventListener('DOMContentLoaded', setupLazyLoading);

// Optimize scroll performance
let ticking = false;

function updateScrollElements() {
    // Handle scroll-based animations and effects here
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateScrollElements);
        ticking = true;
    }
});

// Page visibility API for better performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause animations
        stopSlideShow();
    } else {
        // Page is visible, resume animations
        startSlideShow();
    }
});
