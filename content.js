// Debugging
function removeBanner() {
    console.log('removeBanner function called');
  
    // Function to recursively search for elements, including in shadow DOMs
    function deepQuerySelector(element, selector) {
      const results = Array.from(element.querySelectorAll(selector));
      const shadowRoots = Array.from(element.querySelectorAll('*'))
        .filter(el => el.shadowRoot)
        .map(el => el.shadowRoot);
  
      shadowRoots.forEach(root => {
        results.push(...deepQuerySelector(root, selector));
      });
  
      return results;
    }
  
    // Selectors to try
    const selectors = [
      'faceplate-banner[appearance="error"]',
      'div[role="banner"]',
      '.banner.error',
      '[class*="banner"][class*="error"]'
    ];
  
    let bannerElements = [];
    for (const selector of selectors) {
      bannerElements = deepQuerySelector(document.body, selector);
      if (bannerElements.length > 0) {
        console.log(`Banner(s) found with selector: ${selector}`);
        break;
      }
    }
  
    if (bannerElements.length > 0) {
      bannerElements.forEach(banner => {
        console.log('Banner element found:', banner);
        banner.style.display = 'none';
        console.log('Banner hidden via JavaScript');
  
        // Hide parent elements if they don't contain other content
        let parent = banner.parentElement;
        while (parent && parent !== document.body) {
          if (parent.childElementCount === 1) {
            parent.style.display = 'none';
            console.log(`Parent element hidden: ${parent.tagName}`);
          } else {
            break;
          }
          parent = parent.parentElement;
        }
      });
    } else {
      console.log('Banner element not found by JavaScript');
    }
  }
  
  // Run the function immediately and periodically
  console.log('Content script loaded');
  removeBanner();
  
  // Set up a MutationObserver to watch for changes in the DOM
  const observer = new MutationObserver((mutations) => {
    console.log('DOM mutation detected');
    removeBanner();
  });
  
  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true });
  console.log('MutationObserver started');
  
  // Additionally, try removing the banner periodically
  setInterval(removeBanner, 1000);
  
  // Log if the banner is visually hidden by CSS
  function checkCSSHiding() {
    const elements = document.querySelectorAll('alert-controller, banner-controller, faceplate-banner[appearance="error"]');
    elements.forEach(el => {
      const style = window.getComputedStyle(el);
      if (style.display === 'none') {
        console.log(`Element hidden by CSS: ${el.tagName}`, el);
      }
    });
  }
  setInterval(checkCSSHiding, 2000);