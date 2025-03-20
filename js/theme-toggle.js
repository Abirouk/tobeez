// Theme Toggle Functionality

// Function to set theme
function setTheme(themeName) {
    // Set data-theme attribute on HTML element
    document.documentElement.setAttribute('data-theme', themeName);
    
    // Save theme preference
    localStorage.setItem('theme', themeName);
    
    // Update UI to reflect current theme
    updateThemeUI(themeName);
}

// Function to update UI elements based on theme
function updateThemeUI(themeName) {
    const toggleBtn = document.getElementById('themeToggleBtn');
    if (!toggleBtn) return;
    
    const modeText = toggleBtn.querySelector('.mode-text');
    const darkIcon = toggleBtn.querySelector('.dark-icon');
    const lightIcon = toggleBtn.querySelector('.light-icon');
    
    if (themeName === 'light') {
        modeText.textContent = 'Light';
        darkIcon.classList.add('tw-hidden');
        lightIcon.classList.remove('tw-hidden');
    } else {
        modeText.textContent = 'Dark';
        darkIcon.classList.remove('tw-hidden');
        lightIcon.classList.add('tw-hidden');
    }
}

// Toggle between light and dark themes
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// Initialize theme from saved preference or system preference
function initializeTheme() {
    // Check saved preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        // Use saved preference
        setTheme(savedTheme);
    } else {
        // Default to dark theme
        setTheme('dark');
    }
}

// Set up event listeners
function setupThemeToggle() {
    const toggleBtn = document.getElementById('themeToggleBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleTheme);
        
        // Initialize UI state based on current theme
        const currentTheme = localStorage.getItem('theme') || 'dark';
        updateThemeUI(currentTheme);
    } else {
        // If button not found, try again later
        setTimeout(setupThemeToggle, 100);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    setupThemeToggle();
});

// Also try when components are loaded
document.addEventListener('componentsLoaded', setupThemeToggle);