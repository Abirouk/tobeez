// Wait for components to load before initializing
document.addEventListener('DOMContentLoaded', () => {
    // Load components first
    loadComponents().then(() => {
        console.log("Components loaded, initializing app...");
        initializeApp();
        
        // Initialize animations immediately after components load
        initAnimations();
        
        // Initialize brand carousel
        initBrandCarousel();
        
        // Initialize header scroll behavior
        initHeaderScroll();
        
        // Initialize mobile menu
        initMobileMenu();
        
        // Make sure theme toggle works
        setupThemeToggle();
    });
});

// Function to load components manually
async function loadComponents() {
    // Find all component placeholders
    const componentPlaceholders = document.querySelectorAll('[data-component]');
    const promises = [];
    
    for (const placeholder of componentPlaceholders) {
        const componentPath = placeholder.getAttribute('data-component');
        
        // Create a promise for each component
        const promise = fetch(`${componentPath}?v=${new Date().getTime()}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                placeholder.innerHTML = html;
                
                // Execute any scripts inside the component
                const scripts = placeholder.querySelectorAll('script');
                scripts.forEach(script => {
                    const newScript = document.createElement('script');
                    
                    if (script.src) {
                        newScript.src = script.src;
                    } else {
                        newScript.textContent = script.textContent;
                    }
                    
                    // Copy other attributes
                    Array.from(script.attributes).forEach(attr => {
                        if (attr.name !== 'src') {
                            newScript.setAttribute(attr.name, attr.value);
                        }
                    });
                    
                    // Replace the old script with the new one
                    script.parentNode.replaceChild(newScript, script);
                });
            })
            .catch(error => {
                console.error(`Error loading component ${componentPath}:`, error);
                placeholder.innerHTML = `<div class="tw-p-4">Failed to load component: ${componentPath}</div>`;
            });
            
        promises.push(promise);
    }
    
    // Wait for all components to load
    await Promise.all(promises);
    
    // Dispatch event when all components are loaded
    document.dispatchEvent(new CustomEvent('componentsLoaded'));
}

function initializeApp() {
    // Make sure theme UI is updated
    if (typeof window.updateThemeUI === 'function') {
        window.updateThemeUI();
    }
}

// Setup theme toggle functionality
function setupThemeToggle() {
    // First make sure theme is properly set from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // Add toggle functionality if not already present
    if (typeof window.toggleTheme !== 'function') {
        window.toggleTheme = function() {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            updateThemeUI();
        };
    }
    
    // Add UI update function if not already present
    if (typeof window.updateThemeUI !== 'function') {
        window.updateThemeUI = function() {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            
            // Update desktop theme toggle
            const modeText = document.getElementById('modeText');
            const darkIcon = document.getElementById('darkIcon');
            const lightIcon = document.getElementById('lightIcon');
            
            if (modeText && darkIcon && lightIcon) {
                if (currentTheme === 'light') {
                    modeText.textContent = 'Dark Mode';
                    lightIcon.style.display = 'block';
                    darkIcon.style.display = 'none';
                } else {
                    modeText.textContent = 'Light Mode';
                    lightIcon.style.display = 'none';
                    darkIcon.style.display = 'block';
                }
            }
            
            // Update mobile theme toggle
            const mobileModeText = document.getElementById('mobilemodeText');
            const mobileDarkIcon = document.getElementById('mobiledarkIcon');
            const mobileLightIcon = document.getElementById('mobilelightIcon');
            
            if (mobileModeText && mobileDarkIcon && mobileLightIcon) {
                if (currentTheme === 'light') {
                    mobileModeText.textContent = 'Dark Mode';
                    mobileLightIcon.style.display = 'block';
                    mobileDarkIcon.style.display = 'none';
                } else {
                    mobileModeText.textContent = 'Light Mode';
                    mobileLightIcon.style.display = 'none';
                    mobileDarkIcon.style.display = 'block';
                }
            }
        };
    }
    
    // Update UI immediately
    if (typeof window.updateThemeUI === 'function') {
        window.updateThemeUI();
    }
}

// Function to handle header scroll behavior
function handleHeaderScroll() {
    const header = document.querySelector('.main-header');
    if (header) {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}

// Initialize header scroll functionality
function initHeaderScroll() {
    console.log("Initializing header scroll behavior...");
    window.addEventListener('scroll', handleHeaderScroll);
    
    // Call once to set initial state
    handleHeaderScroll();
}

// Initialize mobile menu functionality
function initMobileMenu() {
    console.log("Initializing mobile menu...");
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            if (mobileMenu.classList.contains('active')) {
                menuButton.innerHTML = '<i class="bi bi-x"></i>';
            } else {
                menuButton.innerHTML = '<i class="bi bi-list"></i>';
            }
        });
    }
}

// Animation initialization function
function initAnimations() {
    console.log("Initializing animations...");
    
    if (typeof gsap === 'undefined') {
        console.error('GSAP library not loaded');
        return;
    }
    
    // Animations
    gsap.registerPlugin(ScrollTrigger);

    // Initial state for reveal-up elements
    gsap.set(".reveal-up", {
        opacity: 0,
        y: "30px",
    });

    // Create a timeline for hero section animations
    const heroTl = gsap.timeline();

    // Animate hero content
    heroTl.to(".hero-section .reveal-up", {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out"
    });

    // Phone mockup animation
    gsap.to(".phone-mockup-container", {
        rotateY: "0deg",
        rotateX: "0deg",
        duration: 1,
        delay: 0.3,
        ease: "power2.out",
    });

    // Section reveal animations
    const sections = gsap.utils.toArray("section:not(#hero-section)");

    sections.forEach((sec) => {
        const revealElements = sec.querySelectorAll(".reveal-up");
        if (revealElements.length > 0) {
            const revealTl = gsap.timeline({
                scrollTrigger: {
                    trigger: sec,
                    start: "top 80%",
                    end: "top 50%",
                    toggleActions: "play none none none"
                }
            });
            
            revealTl.to(revealElements, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out"
            });
        }
    });

    // Ensure wave separator is visible
    gsap.from(".wave-separator", {
        y: 20,
        autoAlpha: 0,
        duration: 0.8,
        delay: 0.5,
        ease: "power2.out"
    });
}

// Brand carousel function
function initBrandCarousel() {
    console.log("Initializing brand carousel...");
    
    if (typeof gsap === 'undefined') {
        console.error('GSAP library not loaded');
        return;
    }
    
    const carousel = document.querySelector('.carousel');
    if (!carousel) {
        console.error('Carousel element not found');
        return;
    }
    
    // Clone the brand logos to create the infinite scrolling effect
    const brandLogos = carousel.querySelectorAll('.carousel-img');
    if (brandLogos.length === 0) {
        console.error('No brand logos found');
        return;
    }
    
    // Create clones for infinite scrolling
    brandLogos.forEach(logo => {
        const clone = logo.cloneNode(true);
        carousel.appendChild(clone);
    });
    
    // Set initial position
    gsap.set(carousel, { x: 0 });
    
    // Calculate total width of original logos
    const totalWidth = Array.from(brandLogos).reduce((width, logo) => {
        return width + logo.offsetWidth + parseInt(window.getComputedStyle(logo).marginRight || 0);
    }, 0);
    
    // Create the infinite scrolling animation
    const infiniteCarousel = gsap.timeline({ repeat: -1 });
    
    infiniteCarousel.to(carousel, {
        x: -totalWidth,
        duration: 30,
        ease: "none",
    });
    
    console.log("Brand carousel initialized with width:", totalWidth);
}

// Also add a direct event listener that will initialize animations and carousel
// when components are loaded, as a fallback approach
document.addEventListener('componentsLoaded', () => {
    console.log("Components loaded event triggered");
    setTimeout(() => {
        initAnimations();
        initBrandCarousel();
        initHeaderScroll();
        initMobileMenu();
        setupThemeToggle();
    }, 100); // Slight delay to ensure DOM is ready
});