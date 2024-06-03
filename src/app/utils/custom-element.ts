export class CustomElement {
  element: HTMLElement;
  type: string;
  className: string;
  props: { [key: string]: string };

  constructor(type, className = '', props = {}, exitElement: HTMLElement | null = null) {
    const children = exitElement?.children;
    const element = exitElement ? exitElement.cloneNode() : document.createElement(type);

    if (children && children.length) {
      Array.from(children).forEach(child => element.appendChild(child.cloneNode()))
    }

    this.type = type;
    this.className = className;
    this.props = props;

    if (className) element.className = className;

    Object.entries(props).forEach(([key, value]) => {
      element[key] = value;
    });

    this.element = element;
  }

  appendChild(child: HTMLElement | CustomElement) {
    if (child instanceof CustomElement) {
      this.element.appendChild(child.getElement());

      return;
    }

    this.element.appendChild(child);
  }

  appendChildren(children: (HTMLElement | CustomElement)[]) {
    children.forEach(child => this.appendChild(child));
  }

  getElement() {
    return this.element;
  }

  setElement(element) {
    this.element = element.cloneNode(true);
  }

  querySelector(selector) {
    return this.element.querySelector(selector);
  }

  setAttribute(attr, value) {
    this.element.setAttribute(attr, value);
  }

  setAttributes(attrs: { [key: string]: string}) {
    Object.entries(attrs).forEach(([key, value]) => this.element.setAttribute(key, value));
  }

  cloneNode() {
    return new CustomElement(this.type, this.className, this.props, this.element);
  }

  setStyle(style) {
    this.element.setAttribute('style', style);
  }
}
