// Theme Toggle Functionality

// Function to set theme
function setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
}

// Function to toggle theme
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'dark') {
        setTheme('light');
    } else {
        setTheme('dark');
    }
    
    // Update toggle UI if it exists
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    if (themeToggle) {
        themeToggle.checked = (currentTheme === 'dark');
    }
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        // Use saved theme
        setTheme(savedTheme);
        
        // Update toggle UI if it exists
        const themeToggle = document.getElementById('theme-toggle-checkbox');
        if (themeToggle) {
            themeToggle.checked = (savedTheme === 'dark');
        }
    } else if (prefersDark) {
        // Use dark theme if system prefers it
        setTheme('dark');
    } else {
        // Default to light theme
        setTheme('light');
    }
    
    // Add event listener to theme toggle
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    if (themeToggle) {
        themeToggle.addEventListener('change', toggleTheme);
    }
});