class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; text-align: center; padding: 20px; }
          .spinner { width: 50px; height: 50px; border: 5px solid rgba(0,0,0,0.1); border-top: 5px solid #4CAF50; border-radius: 50%; animation: spin 1s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        </style>
        <div class="spinner"></div>
      `;
  }
}
customElements.define('loading-indicator', LoadingIndicator);
