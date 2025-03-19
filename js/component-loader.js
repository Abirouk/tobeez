/**
 * Component Loader
 * Loads HTML components into placeholders using fetch API
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
        // Fetch the component HTML
        const response = await fetch(componentPath);
        
        if (!response.ok) {
          throw new Error(`Failed to load component: ${componentPath}`);
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
        
        // If all components are loaded, initialize the page
        if (loadedComponents === totalComponents) {
          // Dispatch an event to signal all components are loaded
          document.dispatchEvent(new CustomEvent('componentsLoaded'));
        }
        
      } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
        placeholder.innerHTML = `<div class="tw-p-4 tw-text-red-500">Failed to load component: ${componentPath}</div>`;
        
        loadedComponents++;
        // Continue loading other components even if one fails
        if (loadedComponents === totalComponents) {
          document.dispatchEvent(new CustomEvent('componentsLoaded'));
        }
      }
    }
  });