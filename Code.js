// Global Variables
let currentSlide = 0;
let heroImages = [];
let slideInterval;
let isLoading = true;

// Background Images from provided URLs
const backgroundImages = [
    'https://media.istockphoto.com/id/1475065175/photo/toddler-at-a-check-up.jpg?s=612x612&w=0&k=20&c=KnA6Y3HFdd0GuIkYElmRLJCWW_ye47ktJAGirQ_AAzk=',
    'https://media.istockphoto.com/id/91156547/photo/nurse-tending-patient-in-intensive-care.jpg?s=2048x2048&w=is&k=20&c=Qx3e1dDIqY3Y6-wiRuFqZvPYJeVDHNxXKFVSl5bOKIo=',
    'https://media.istockphoto.com/id/1351391194/photo/doctors-assisting-patients-at-the-hospital.jpg?s=612x612&w=0&k=20&c=wk_sx1rz9lt-l3zk_DDoA-OkBkYlHryUsiVDQDAhcEo=',
    'https://media.istockphoto.com/id/1281627829/photo/modern-operating-room-in-a-hospital-generated-digitally.jpg?s=612x612&w=0&k=20&c=d3KQ2gTteSyGz_OgVqsey91azFDVhEwYPXPJheNFNKU=',
    'https://cdn.pixabay.com/photo/2022/12/17/14/20/vitamins-7661774_640.jpg',
    'https://cdn.pixabay.com/photo/2023/02/07/01/37/injection-7773033_640.jpg',
    'https://cdn.pixabay.com/photo/2020/03/08/23/23/coronavirus-4914026_1280.jpg',
    'https://cdn.pixabay.com/photo/2020/03/12/20/09/stethoscope-4926153_640.jpg',
    'https://cdn.pixabay.com/photo/2016/11/08/05/29/surgery-1807541_640.jpg',
    'https://media.istockphoto.com/id/1319031310/photo/doctor-writing-a-medical-prescription.jpg?s=612x612&w=0&k=20&c=DWZGM8lBb5Bun7cbxhKT1ruVxRC_itvFzA9jxgoA0N8=',
    'https://cdn.pixabay.com/photo/2020/03/05/16/58/hospital-4904920_1280.jpg',
    'https://cdn.pixabay.com/photo/2016/11/08/05/29/surgery-1807541_1280.jpg',
    'https://media.istockphoto.com/id/155099359/photo/stethoscope-on-book.jpg?s=2048x2048&w=is&k=20&c=DhDiyvhICqv4siqcpuRq31G4bHNDxk0i3iAcPyAiVfs=',
    'https://cdn.pixabay.com/photo/2014/12/10/20/48/laboratory-563423_1280.jpg'
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
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (validateContactForm(data)) {
        showSuccessMessage('Thank you for your message! We will get back to you soon.');
        e.target.reset();
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
function handleAppointmentForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (validateAppointmentForm(data)) {
        showSuccessMessage('Your appointment request has been submitted! We will contact you shortly to confirm.');
        closeAppointmentModal();
        e.target.reset();
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

// Handle Login Form
function handleLoginForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (validateLoginForm(data)) {
        showSuccessMessage('Login functionality would be implemented with backend integration.');
        closePortalModal();
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
function handleRegisterForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (validateRegisterForm(data)) {
        showSuccessMessage('Registration functionality would be implemented with backend integration.');
        closePortalModal();
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
