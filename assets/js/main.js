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
    this.fetchAndSetHTML(this.getAttribute('src'));
  }

  async fetchAndSetHTML(src) {
    if (!src) {
      console.error('HTMLInclude: src attribute is missing.');
      return;
    }

    try {
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${src}: ${response.statusText}`);
      }
      const html = await response.text();
      this.innerHTML = html;
    } catch (error) {
      console.error(`Error loading content for HTMLInclude:`, error);
      this.innerHTML = `<p style="color:red">Error loading content from ${src}</p>`;
    }
  }
}

// Define the custom element
if (!customElements.get('html-include')) {
    customElements.define('html-include', HTMLInclude);
}

// Load global CSS
// document.addEventListener('DOMContentLoaded', () => {
//     const link = document.createElement('link');
//     link.rel = 'stylesheet';
//     link.href = '/assets/css/global.css';
//     document.head.appendChild(link);
// });
