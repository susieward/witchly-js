export default class Content {
  name = 'app-content'

  static get observedAttributes() {
    return ['title-text']
  }

  get template() {
    return (
      <div class="content">
        <h2>{this['title-text']}</h2>
        <slot></slot>
      </div>
    )
  }
}
