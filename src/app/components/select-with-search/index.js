class SelectWithSearch extends HTMLElement {
  constructor () {
    super();

    this.isOpen = false;
    this.commonOptions = [];

    const template = document.getElementById("select-with-search");
    const templateContent = template.cloneNode(true).content;

    this.content = templateContent;
    this.options = [];

    const tabIndex = template.getAttribute('index2');

    const selectHideButton = templateContent.querySelector('.select__hide-button');
    selectHideButton.addEventListener('click', this.togglePopup);

    const selectInput = templateContent.querySelector('.select__input');
    selectInput.addEventListener('input', this.handleInputChange);
    selectInput.tabIndex = tabIndex;

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(templateContent);

    this.popup = shadowRoot.querySelector('.select__container');
    this.input = shadowRoot.querySelector('.select__input');
    this.selectContainer = shadowRoot.querySelector('.select__container');
    this.select = shadowRoot.querySelector('.select');

    document.querySelector('html').addEventListener('click', this.handleExternalClick);
  }

  static get observedAttributes() { return ['options', 'mix']; }

  attributeChangedCallback(name, oldValue, newValue) {
    // console.log('%c%s', 'background: cadetblue; padding: 8px;', 'attributeChangedCallback ' + name);
    if (name === 'options') {
      this.setOptions(JSON.parse(newValue), this.popup);

      const tabIndex = +this.getAttribute('index');

      this.select.querySelector('.select__field').tabIndex = -1;
      this.select.querySelector('.select__input').tabIndex = tabIndex;
      this.select.querySelector('.select__hide-button').tabIndex = tabIndex + 1;

      const newValue1 = this.getAttribute('value1');

      if (newValue1) {
        // TODO должен как-то в init выполняться
        this.select.querySelector('.select__input').value = this.getAttribute('value1');
      }
    }

    if (name === 'mix' && newValue) {
      const newClasses = Array.isArray(newValue) ? newValue : [newValue];
      const input = this.select.querySelector('.select__field');

      newClasses.forEach(className => input.classList.add(className));
    }
  }

  disconnectedCallback() {
    const selectHideButton = this.select.querySelector('.select__hide-button');
    selectHideButton.removeEventListener('click', this.togglePopup);
  }

  handleInputChange = () => {
    const searchString = (this.input.value || '').toLowerCase();

    this.setOptions(
      this.commonOptions.filter(({ label }) => label.toLowerCase().includes(searchString)),
      this.popup,
      true,
    );

    // Переделать в Open и Close
    this.popup.classList.remove('hide');
  }

  setOptions = (options, popup, isFilter) => {
    popup.innerHTML = null;

    options.forEach(option => this.setOption(option, popup));

    if (!isFilter) {
      this.commonOptions = options;
    }
  }

  setOption = ({ id, label }, popup, isDefault) => {
    const optionNode = document.createElement('div');
    optionNode.className = 'select__option';
    optionNode.innerHTML = label;
    optionNode.id = id;
    optionNode.addEventListener('click', this.selectOption);

    popup.appendChild(optionNode);
  }

  addOption = () => {
    const newValue = this.input.value;

    if (!newValue || this.options.some(({ label }) => label === newValue)) return;

    this.newOption = this.input.value;

    this.dispatchEvent(new CustomEvent('addOption'));

    if (!this.popup.classList.contains('hide')) {
      this.togglePopup();
    }
  }

  togglePopup = () => {
    this.popup.classList.toggle('hide');
  }

  selectOption = event => {
    this.input.value = event.currentTarget.innerHTML;
    this.togglePopup();
    this.dispatchEvent(new CustomEvent('selectOption'));
  }

  handleExternalClick = event => {
    const target = event.target;

    if (target.id !== this.id || (
      target.classList.contains(/select/)
        && !target.classList.contains('select__hide-button')
      )
    ) {
      this.popup.classList.add('hide');
    }
  }
}

customElements.define("select-with-search", SelectWithSearch); // (2)
