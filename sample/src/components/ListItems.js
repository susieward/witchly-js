
export default class ListItems {
  name = 'list-items'
  message = ''

  static get observedAttributes() {
    return ['items']
  }

  createdCallback() {
    this.message = 'hello from a child component!'
  }

  connectedCallback() {
    this.$emit('message', this.message)
  }

  disconnectedCallback() {
    this.$emit('message', 'bye!')
  }

  get template() {
    return (
      <ul>{this.currentItems}</ul>
    )
  }

  get currentItems() {
    if (!this.items) return
    return this.items.map((item, i) => {
      return (
        <li
          data-index={i}
          onclick={() => this.$emit('remove', i)}>
          {item}
        </li>
      )
    })
  }
}
