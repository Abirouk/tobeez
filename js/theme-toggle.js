// Theme Toggle Functionality

// Apply theme from localStorage or system preference on page load
document.addEventListener('DOMContentLoaded', function() {
    // Get saved theme or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply theme
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark'); // Default to dark
    }
    
    // Log current theme
    console.log("Initial theme:", document.documentElement.getAttribute('data-theme'));
    
    // Try to update toggle if it exists
    updateThemeUI();
});

// Listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (!localStorage.getItem('theme')) {
        document.documentElement.setAttribute('data-theme', event.matches ? 'dark' : 'light');
        updateThemeUI();
    }
});

// Global function to toggle theme
window.toggleTheme = function() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    updateThemeUI();
    console.log(`Theme switched to ${newTheme}`);
};

// Function to update UI elements based on current theme
function updateThemeUI() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    
    // Update toggle button text and icon if it exists
    const modeText = document.getElementById('modeText');
    const darkIcon = document.getElementById('darkIcon');
    const lightIcon = document.getElementById('lightIcon');
    
    if (modeText && darkIcon && lightIcon) {
        if (currentTheme === 'light') {
            modeText.textContent = 'Light Mode';
            darkIcon.classList.add('tw-hidden');
            lightIcon.classList.remove('tw-hidden');
        } else {
            modeText.textContent = 'Dark Mode';
            darkIcon.classList.remove('tw-hidden');
            lightIcon.classList.add('tw-hidden');
        }
    }
}

// Add global access to theme functions
window.updateThemeUI = updateThemeUI;