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
    
    // Update UI elements
    updateThemeUI();
});

// Listen for components loaded event 
document.addEventListener('componentsLoaded', function() {
    updateThemeUI();
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
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    
    if (modeText && darkIcon && lightIcon && themeToggleBtn) {
        if (currentTheme === 'light') {
            modeText.textContent = 'Light Mode';
            lightIcon.style.display = 'block';
            darkIcon.style.display = 'none';
            themeToggleBtn.classList.add('light-theme-active');
            themeToggleBtn.classList.remove('dark-theme-active');
        } else {
            modeText.textContent = 'Dark Mode';
            lightIcon.style.display = 'none';
            darkIcon.style.display = 'block';
            themeToggleBtn.classList.add('dark-theme-active');
            themeToggleBtn.classList.remove('light-theme-active');
        }
    }
}

// Add global access to theme functions
window.updateThemeUI = updateThemeUI;