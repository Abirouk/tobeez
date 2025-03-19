// Wait for components to load before initializing
document.addEventListener('componentsLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // initialization
    const RESPONSIVE_WIDTH = 1024;
    
    let headerWhiteBg = false;
    let isHeaderCollapsed = window.innerWidth < RESPONSIVE_WIDTH;
    const collapseBtn = document.getElementById("collapse-btn");
    const collapseHeaderItems = document.getElementById("collapsed-header-items");
    
    function onHeaderClickOutside(e) {
        if (!collapseHeaderItems.contains(e.target)) {
            toggleHeader();
        }
    }
    
    window.toggleHeader = function() {
        if (isHeaderCollapsed) {
            // collapseHeaderItems.classList.remove("max-md:tw-opacity-0")
            collapseHeaderItems.classList.add("opacity-100",);
            collapseHeaderItems.style.width = "60vw";
            collapseBtn.classList.remove("bi-list");
            collapseBtn.classList.add("bi-x", "max-lg:tw-fixed");
            isHeaderCollapsed = false;
    
            setTimeout(() => window.addEventListener("click", onHeaderClickOutside), 1);
    
        } else {
            collapseHeaderItems.classList.remove("opacity-100");
            collapseHeaderItems.style.width = "0vw";
            collapseBtn.classList.remove("bi-x", "max-lg:tw-fixed");
            collapseBtn.classList.add("bi-list");
            isHeaderCollapsed = true;
            window.removeEventListener("click", onHeaderClickOutside);
        }
    }
    
    function responsive() {
        if (window.innerWidth > RESPONSIVE_WIDTH) {
            collapseHeaderItems.style.width = "";
        } else {
            isHeaderCollapsed = true;
        }
    }
    
    window.addEventListener("resize", responsive);
    
    // Initialize FAQ accordions
    initFaqAccordion();
    
    // Initialize animations
    initAnimations();
}

function initFaqAccordion() {
    const faqAccordion = document.querySelectorAll('.faq-accordion');
    
    faqAccordion.forEach(function (btn) {
        btn.addEventListener('click', function () {
            this.classList.toggle('active');
    
            // Toggle 'rotate' class to rotate the arrow
            let content = this.nextElementSibling;
            
            // content.classList.toggle('!tw-hidden')
            if (content.style.maxHeight === '200px') {
                content.style.maxHeight = '0px';
                content.style.padding = '0px 18px';
            } else {
                content.style.maxHeight = '200px';
                content.style.padding = '20px 18px';
            }
        });
    });
}

function initAnimations() {
    if (typeof gsap === 'undefined') {
        console.error('GSAP library not loaded');
        return;
    }
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Initial state for reveal-up elements
    gsap.to(".reveal-up", {
        opacity: 0,
        y: "100%",
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
        const revealUptimeline = gsap.timeline({
            paused: true, 
            scrollTrigger: {
                trigger: sec,
                start: "10% 80%",
                end: "20% 90%",
            }
        });
    
        revealUptimeline.to(sec.querySelectorAll(".reveal-up"), {
            opacity: 1,
            duration: 0.8,
            y: "0%",
            stagger: 0.2,
        });
    });
}

// If components are already loaded when this script runs, initialize immediately
if (document.querySelectorAll('[data-component]').length === 0) {
    initializeApp();
}