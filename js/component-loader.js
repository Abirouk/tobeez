/**
 * Component Loader with improved error handling
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Find all component placeholders
  const componentPlaceholders = document.querySelectorAll('[data-component]');
  let loadedComponents = 0;
  const totalComponents = componentPlaceholders.length;
  
  // Load each component
  for (const placeholder of componentPlaceholders) {
    const componentPath = placeholder.getAttribute('data-component');
    
    try {
      // Fetch with cache-busting parameter
      const response = await fetch(`${componentPath}?v=${new Date().getTime()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const componentHTML = await response.text();
      
      // Insert the component HTML
      placeholder.innerHTML = componentHTML;
      
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
      
      loadedComponents++;
      
    } catch (error) {
      console.error(`Error loading component ${componentPath}:`, error);
      
      // Add a minimal placeholder to prevent layout shifts
      placeholder.innerHTML = `<div class="tw-p-4">Failed to load component: ${componentPath}</div>`;
      loadedComponents++;
    }
    
    // Check if all components are loaded
    if (loadedComponents === totalComponents) {
      document.dispatchEvent(new CustomEvent('componentsLoaded'));
    }
  }
});