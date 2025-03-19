// Theme Toggle Functionality

// Function to set theme
function setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
    
    // Update checkbox state based on the theme
    const themeToggle = document.getElementById('themeSwitcherOne');
    if (themeToggle) {
        themeToggle.checked = (themeName === 'light');
    }
}

// Toggle theme function
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'dark') {
        setTheme('light');
    } else {
        setTheme('dark');
    }
}

// Initialize theme
function initTheme() {
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        // Use saved theme
        setTheme(savedTheme);
    } else if (prefersDark) {
        // Use dark theme if system prefers it
        setTheme('dark');
    } else {
        // Default to light theme
        setTheme('light');
    }
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    
    // Add event listener to the theme switch checkbox
    document.addEventListener('componentsLoaded', function() {
        const themeSwitch = document.getElementById('themeSwitcherOne');
        if (themeSwitch) {
            themeSwitch.addEventListener('change', function() {
                toggleTheme();
            });
        }
    });
});