export default {
  name: 'app-content',
  render() {
    return (
      <div class="content">
        <h2>{this['title-text']}</h2>
        <slot></slot>
      </div>
    )
  },
  get styles() {
    return (
      `.content {
        display: grid;
        width: 100%;
        max-width: 900px;
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
