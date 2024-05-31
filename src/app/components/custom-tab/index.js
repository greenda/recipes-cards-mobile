class CustomTab extends HTMLElement {
  constructor() {
    super();

    const template = document.getElementById("tab");
    const templateContent = template.cloneNode(true).content;

    const day = template.getAttribute('day');

    console.log('%c%s', 'background: cadetblue; padding: 8px;', day);

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(templateContent);

    this.tabText = shadowRoot.querySelector('.tab__text');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('%c%s', 'background: cadetblue; padding: 8px;', 'attributeChangedCallback');
    if (name === 'day') {
      this.tabText.querySelector('span:nth-child(1)').innerText = newValue;
    }

    if (name === 'date') {
      this.tabText.querySelector('span:nth-child(2)').innerText = newValue;
    }
  }

  static get observedAttributes() { return ['day', 'date']; }
}

customElements.define("custom-tab", CustomTab);

