export default {
  name: 'app-content',
  get template() {
    return (
      <div class="content">
        <h2>{this.getAttribute('title-text')}</h2>
        <slot></slot>
      </div>
    )
  },
  get styles() {
    return (
      `.content {
        grid-area: content;
        display: grid;
        max-width: 1fr;
        width: 900px;
        min-width: auto;
        background-color: var(--content-bg-color);
        box-shadow: 0 6px 8px rgb(85 102 119 / 3%), 0 1px 1px rgb(85 102 119 / 40%);
        background-color: #fff;
        border: 1px solid transparent;
        border-radius: 3px;
        padding: 25px 30px;
      }`
    )
  }
}
