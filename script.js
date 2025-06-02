// Main application functionality
class KitchenWebsite {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = window.translations || {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupLazyLoading();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupContactForm();
        this.setupLanguageSwitcher();
        this.setupVideoLazyLoading();
        this.updateLanguage(this.currentLanguage);
    }

    setupEventListeners() {
        // Navbar scroll effect
        window.addEventListener('scroll', this.handleNavbarScroll.bind(this));
        
        // Resize handler
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Gallery hover effects
        this.setupGalleryEffects();
    }

    handleNavbarScroll() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = 'hsla(var(--surface), 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.backgroundColor = 'hsla(var(--surface), 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }

    handleResize() {
        // Close mobile menu on resize
        const navMenu = document.getElementById('nav-menu');
        const hamburger = document.getElementById('hamburger');
        
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }

    setupLazyLoading() {
        const lazyImages = document.querySelectorAll('.lazy-image');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.classList.add('loaded');
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        lazyImages.forEach(img => {
            img.classList.add('loading');
            imageObserver.observe(img);
        });
    }

    setupMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupContactForm() {
        const form = document.getElementById('contact-form');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });

        // Add floating label effect
        const formInputs = form.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.value.trim() !== '') {
                    input.classList.add('has-value');
                } else {
                    input.classList.remove('has-value');
                }
            });
        });
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission (since no backend)
        this.showFormMessage('success', this.getTranslation('form_success') || 'Thank you! Your message has been sent.');
        form.reset();
        
        // Remove floating label classes
        form.querySelectorAll('.has-value').forEach(input => {
            input.classList.remove('has-value');
        });
    }

    showFormMessage(type, message) {
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 8px;
            background-color: ${type === 'success' ? '#d4edda' : '#f8d7da'};
            color: ${type === 'success' ? '#155724' : '#721c24'};
            border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
        `;

        const form = document.getElementById('contact-form');
        form.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    setupLanguageSwitcher() {
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                this.switchLanguage(lang);
            });
        });
    }

    switchLanguage(lang) {
        if (this.currentLanguage === lang) return;
        
        this.currentLanguage = lang;
        
        // Update active button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });
        
        // Update HTML attributes
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        // Update content
        this.updateLanguage(lang);
    }

    updateLanguage(lang) {
        const elements = document.querySelectorAll('[data-translate]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.getTranslation(key, lang);
            
            if (translation) {
                if (element.tagName === 'INPUT' && element.type !== 'submit') {
                    element.placeholder = translation;
                } else if (element.tagName === 'OPTION') {
                    element.textContent = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Update form placeholders and options specifically
        this.updateFormTranslations(lang);
    }

    updateFormTranslations(lang) {
        // Update select options
        const serviceSelect = document.getElementById('service');
        if (serviceSelect) {
            const options = serviceSelect.querySelectorAll('option[data-translate]');
            options.forEach(option => {
                const key = option.getAttribute('data-translate');
                const translation = this.getTranslation(key, lang);
                if (translation) {
                    option.textContent = translation;
                }
            });
        }
    }

    getTranslation(key, lang = this.currentLanguage) {
        return this.translations[lang] && this.translations[lang][key] 
            ? this.translations[lang][key] 
            : this.translations['en'][key] || key;
    }

    setupGalleryEffects() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    setupVideoLazyLoading() {
        const videoPlaceholder = document.getElementById('video-placeholder');
        const iframe = document.getElementById('company-video');
        
        if (videoPlaceholder && iframe) {
            videoPlaceholder.addEventListener('click', () => {
                const src = iframe.getAttribute('data-src');
                if (src) {
                    iframe.src = src;
                    iframe.style.display = 'block';
                    videoPlaceholder.style.display = 'none';
                }
            });
        }
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Service Worker Registration (for better performance)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Only register if we have a service worker file
        // This is optional and can be implemented later
    });
}

// Performance optimization
document.addEventListener('DOMContentLoaded', () => {
    // Preload critical images
    const criticalImages = [
        'https://pixabay.com/get/gdae07b40eda9603e4229533959a0002fc07e4ec72de2116e147e7829007060e5a742c16ec59f67db16b353ab34726bee5d22c148083a3c13ef6b4a1e93d14403_1280.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new KitchenWebsite();
});

// Analytics and tracking (placeholder)
class Analytics {
    static track(event, data = {}) {
        // Implement your analytics tracking here
        console.log('Analytics:', event, data);
    }
    
    static trackPageView(page) {
        this.track('page_view', { page });
    }
    
    static trackContactForm() {
        this.track('contact_form_submit');
    }
    
    static trackLanguageSwitch(language) {
        this.track('language_switch', { language });
    }
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    // You can implement error reporting here
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// Export for potential testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { KitchenWebsite, Analytics };
}
