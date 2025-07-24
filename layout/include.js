class HTMLInclude extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
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
      // Use a full path from the root
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${src}: ${response.statusText}`);
      }
      const html = await response.text();
      this.shadowRoot.innerHTML = html;
    } catch (error) {
      console.error(`Error loading content for HTMLInclude:`, error);
      this.shadowRoot.innerHTML = `<p style="color:red">Error loading content from ${src}</p>`;
    }
  }
}

customElements.define('html-include', HTMLInclude);
