export default {
  name: 'app-content',
  render: (vm) => {
    const title = vm['title-text']
    return (
      <article class="content-container">
        {title && <h1>{title}</h1>}
        <slot></slot>
      </article>
    )
  },
  get styles() {
    return (`
      .content-container {
        display: grid;
        background-color: var(--content-bg-color);
        padding: 0 1em;
        width: 100%;
        max-width: 60vw;
      }
      .content-container h1 {
        border-bottom: 1px solid #eee;
      }`
    )
  }
}
