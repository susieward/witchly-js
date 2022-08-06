
export default class ListItems {
  name = 'list-items'
  message = 'hello from a child component!'

  static get observedAttributes() {
    return ['items']
  }

  connectedCallback() {
    this.$emit('message', this.message)
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
