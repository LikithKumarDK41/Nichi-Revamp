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
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        overlay.classList.toggle('open');
      });
    }

    // Mobile dropdown toggle
    const dropdownLinks = this.querySelectorAll('.dropdown-mobile > a');
    dropdownLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const parentLi = link.closest('li');
        parentLi.classList.toggle('open');
        const submenu = parentLi.querySelector('ul');
        if (submenu) submenu.classList.toggle('open');
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
          if (submenu) {
            submenu.classList.add('open');
            submenu.style.display = 'block';
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

