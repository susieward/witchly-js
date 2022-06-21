export default class ContentElement {
  el = 'content-element'

  static get observedAttributes() {
    return ['title-text']
  }

  get template() {
    return (
      <div class="content">
        <h2>{this.getAttribute('title-text')}</h2>
        <slot></slot>
      </div>
    )
  }
}
