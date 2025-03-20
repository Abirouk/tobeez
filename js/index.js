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
    // initialization
    const RESPONSIVE_WIDTH = 1024;
    
    let headerWhiteBg = false;
    let isHeaderCollapsed = true;
    const collapseBtn = document.getElementById("collapse-btn");
    const collapseHeaderItems = document.getElementById("collapsed-header-items");
    
    function onHeaderClickOutside(e) {
        if (!collapseHeaderItems.contains(e.target) && !collapseBtn.contains(e.target)) {
            toggleHeader();
        }
    }
    
    window.toggleHeader = function() {
        if (isHeaderCollapsed) {
            collapseHeaderItems.classList.add("active");
            collapseHeaderItems.style.width = "300px";
            collapseBtn.classList.remove("bi-list");
            collapseBtn.classList.add("bi-x");
            isHeaderCollapsed = false;
    
            setTimeout(() => window.addEventListener("click", onHeaderClickOutside), 100);
        } else {
            collapseHeaderItems.classList.remove("active");
            collapseHeaderItems.style.width = "0";
            collapseBtn.classList.remove("bi-x");
            collapseBtn.classList.add("bi-list");
            isHeaderCollapsed = true;
            window.removeEventListener("click", onHeaderClickOutside);
        }
    };
    
    function responsive() {
        if (window.innerWidth > RESPONSIVE_WIDTH) {
            collapseHeaderItems.style.width = "auto";
            if (!isHeaderCollapsed) {
                isHeaderCollapsed = true;
                collapseBtn.classList.remove("bi-x");
                collapseBtn.classList.add("bi-list");
                window.removeEventListener("click", onHeaderClickOutside);
            }
        } else if (isHeaderCollapsed) {
            collapseHeaderItems.style.width = "0";
        }
    }
    
    window.addEventListener("resize", responsive);
    
    // Call responsive once on init
    responsive();
    
    // Make sure theme UI is updated
    if (typeof window.updateThemeUI === 'function') {
        window.updateThemeUI();
    }
}

// Function to handle header scroll behavior
function handleHeaderScroll() {
    const header = document.getElementById('main-header');
    if (header) {
        if (window.scrollY > 60) {
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
        y: "100px",
    });

    // Dashboard animation
    gsap.to("#dashboard", {
        scale: 1,
        translateY: 0,
        rotateX: "0deg",
        scrollTrigger: {
            trigger: "#hero-section",
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
        }
    });

    // Section reveal animations
    const sections = gsap.utils.toArray("section");

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
    }, 100); // Slight delay to ensure DOM is ready
});

// Add CSS for carousel
document.addEventListener('DOMContentLoaded', () => {
    // Add carousel styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .carousel-container {
            width: 100%;
            overflow: hidden;
            position: relative;
        }
        
        .carousel {
            display: flex;
            align-items: center;
            gap: 40px;
            transition: transform 0.3s ease;
        }
        
        .carousel-img {
            min-width: 150px;
            display: flex;
            justify-content: center;
        }
    `;
    document.head.appendChild(style);
});