
export default class ContentElement {
  el = 'content-element'

  static get observedAttributes() {
    return ['title-text']
  }

  get template() {
    return `
      <div class="content">
        ${this.title}
        <slot></slot>
      </div>
    `
  }

  get title() {
    return this['title-text'] ? `<h2>${this['title-text']}</h2>` : ''
  }
}
