class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 8px; }
        </style>
        <h1>Notes App</h1>
      `;
  }
}
customElements.define('app-header', AppHeader);
