/**
 * Defines the <html-include> custom element.
 * Fetches and injects HTML content from a specified src attribute.
 * Uses absolute paths from the site root (e.g., /layout/header.html).
 */
class HTMLInclude extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const src = this.getAttribute('src');
    if (!src) {
      console.error('HTMLInclude: src attribute is missing.');
      return;
    }

    this.fetchAndSetHTML(src);
  }

  async fetchAndSetHTML(src) {
    try {
      const response = await fetch(src);
      if (!response.ok) throw new Error(`Failed to fetch ${src}: ${response.statusText}`);

      const html = await response.text();
      this.innerHTML = html;

      // After content is loaded, initialize functionality
      this.initializeMobileMenu();
      this.highlightActiveMenuItems();
    } catch (error) {
      console.error(`Error loading content for HTMLInclude:`, error);
      this.innerHTML = `<p style="color:red">Error loading content from ${src}</p>`;
    }
  }

  initializeMobileMenu() {
    // Hamburger toggle
    const hamburger = this.querySelector('#hamburger-menu');
    const overlay = this.querySelector('#mobile-nav-overlay');

    if (hamburger && overlay) {
  const closeBtn = overlay.querySelector('#mobile-close-btn');

  hamburger.addEventListener('click', () => {
    overlay.classList.add('open');
    hamburger.classList.add('hamburger-hidden'); // Hide hamburger when menu is open
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('open');
      hamburger.classList.remove('hamburger-hidden'); // Show hamburger again
    });
  }
}


    // Mobile dropdown toggle using arrow only
const dropdownArrows = this.querySelectorAll('.dropdown-mobile .dropdown-arrow');

dropdownArrows.forEach(arrow => {
  arrow.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();

    const parentLi = arrow.closest('li');
    const submenu = parentLi.querySelector('ul');

    parentLi.classList.toggle('open');
    if (submenu) submenu.classList.toggle('open');
  });
});

// Allow main menu items to navigate to their pages
const dropdownLinks = this.querySelectorAll('.dropdown-mobile > a');
dropdownLinks.forEach(link => {
  link.addEventListener('click', e => {
    // Only prevent default if the click was on the dropdown arrow
    if (e.target.classList.contains('dropdown-arrow') || link.querySelector('.dropdown-arrow').contains(e.target)) {
      e.preventDefault();
    }
    // Otherwise, let the link navigate normally
  });
});
  }

 highlightActiveMenuItems() {
  const currentUrl = window.location.href;
  const currentPath = window.location.pathname.replace(/\/$/, '');
  const allLinks = this.querySelectorAll('.main-nav a, .mobile-nav a');

  allLinks.forEach(link => {
    const linkUrl = new URL(link.href, window.location.origin);
    const linkPath = linkUrl.pathname.replace(/\/$/, '');

    const isExactMatch = currentUrl === linkUrl.href;
    const isPathMatch = currentPath === linkPath;
    const isSectionMatch = linkPath !== '/index.html' && currentPath.startsWith(linkPath);

    if (isExactMatch || isPathMatch || isSectionMatch) {
      link.classList.add('active');

      // Highlight submenu path
      let li = link.closest('li');
      while (li) {
        const parentLi = li.closest('ul')?.closest('li');
        if (parentLi) {
          parentLi.classList.add('submenu-active');

          const parentLink = parentLi.querySelector('a');
          if (parentLink) parentLink.classList.add('active');

          const submenu = parentLi.querySelector('ul');

const isMobile = window.innerWidth <= 1024;
if (submenu && isMobile) {
  // Only apply open state on mobile
  submenu.classList.add('open');
  parentLi.classList.add('open');
}

        }
        li = parentLi;
      }
    }
  });
}






}

// Define the custom element
if (!customElements.get('html-include')) {
  customElements.define('html-include', HTMLInclude);
}

// Define the custom element
if (!customElements.get('html-include')) {
  customElements.define('html-include', HTMLInclude);
}

// Back to Top setup
function initializeBackToTopButton() {
  const backToTopButton = document.getElementById('back-to-top');

  if (!backToTopButton) return;

  // Show/hide button on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });

  // Scroll to top on click
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Run it after everything's loaded
document.addEventListener('DOMContentLoaded', () => {
  // In case the button exists in the base HTML
  initializeBackToTopButton();

  // Also observe the DOM for when back-to-top is included later via <html-include>
  const observer = new MutationObserver(() => {
    const button = document.getElementById('back-to-top');
    if (button && !button.dataset.initialized) {
      button.dataset.initialized = 'true';
      initializeBackToTopButton();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
   // Get references to the relevant DOM elements for tab functionality
        const tabButtons = document.querySelectorAll(".tab-button");
        const tabContents = document.querySelectorAll(".tab-content");
        const jobTypeInput = document.getElementById("job-type");

        // Function to activate a tab
        function activateTab(tabId) {
            tabButtons.forEach(button => {
                if (button.dataset.tab === tabId) {
                    button.classList.add("active");
                } else {
                    button.classList.remove("active");
                }
            });

            tabContents.forEach(content => {
                if (content.id === tabId) {
                    content.classList.add("active");
                } else {
                    content.classList.remove("active");
                }
            });
        }

        // Event listeners for tab buttons
        tabButtons.forEach(button => {
            button.addEventListener("click", () => {
                activateTab(button.dataset.tab);
            });
        });

        // Handle "Apply Now" buttons
        const applyNowButtons = document.querySelectorAll(".apply-now-btn");
        applyNowButtons.forEach(button => {
            button.addEventListener("click", function (event) {
                event.preventDefault();
                const jobTitle = this.dataset.jobTitle;
                activateTab('job-application');
                if (jobTypeInput) {
                    jobTypeInput.value = jobTitle;
                }
                const jobFormSection = document.getElementById("job-application");
                if (jobFormSection) {
                    jobFormSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Original functionality for "Click Here" and "here" link within "Current Openings" tab
        const showMessageBtn = document.getElementById("careers-click-here");
        const noOpeningsMessage = document.getElementById("no-openings-message");
        const jobsApplyLink = document.getElementById("jobs-apply-link");

        // Initially hide the "no-openings-message" as we now have job listings
        // and hide the "Click Here" button.
        if (noOpeningsMessage) {
            noOpeningsMessage.style.display = 'none'; // Use style.display to hide
            if (showMessageBtn) {
                showMessageBtn.style.display = 'none';
            }
        }

        // This part is largely redundant with dummy jobs, but kept for robustness.
        // It would show the message if the "Click Here" button was visible and clicked.
        if (showMessageBtn) {
            showMessageBtn.addEventListener("click", function (event) {
                event.preventDefault();
                if (noOpeningsMessage) {
                    noOpeningsMessage.style.display = 'block'; // Show message
                }
                showMessageBtn.style.display = 'none'; // Hide button
            });
        }

        // This handles the "send us your resume here" link within the no-openings-message
        if (jobsApplyLink) {
            jobsApplyLink.addEventListener("click", function (event) {
                event.preventDefault();
                activateTab('job-application');
                const jobFormSection = document.getElementById("job-application");
                if (jobFormSection) {
                    jobFormSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // File Upload Functionality
        document.addEventListener('DOMContentLoaded', function() {
            const fileInput = document.getElementById('resume');
            const customTrigger = document.getElementById('custom-file-trigger');
            const fileNameDisplay = document.getElementById('file-name-display');

            if (customTrigger && fileInput && fileNameDisplay) {
                // Trigger file input when custom button is clicked
                customTrigger.addEventListener('click', function() {
                    fileInput.click();
                });

                // Update file name display when a file is selected
                fileInput.addEventListener('change', function() {
                    if (fileInput.files.length > 0) {
                        fileNameDisplay.textContent = fileInput.files[0].name;
                        fileNameDisplay.classList.add('file-selected');
                        customTrigger.classList.add('file-selected');
                    } else {
                        fileNameDisplay.textContent = 'No file chosen';
                        fileNameDisplay.classList.remove('file-selected');
                        customTrigger.classList.remove('file-selected');
                    }
                });
            }
        });
