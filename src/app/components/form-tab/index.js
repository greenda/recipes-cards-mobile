class FormTab extends HTMLElement {
  constructor() {
    super();

    const template = document.getElementById("form-tab");
    const templateContent = template.cloneNode(true).content;

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(templateContent);

    this.tabText = shadowRoot.querySelector('.form-tab__text');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'text') {
      this.tabText.querySelector('span').innerText = newValue;
    }
  }

  static get observedAttributes() { return ['text']; }
}

customElements.define("form-tab", FormTab);

