
export default class ContentElement {
  name = 'content-element'

  static get observedAttributes() {
    return ['title-text']
  }

  get template() {
    return `
      <div class="content">
        <h2 data-if="${this['title-text']}">${this['title-text']}</h2>
        <slot></slot>
      </div>
    `
  }
}
