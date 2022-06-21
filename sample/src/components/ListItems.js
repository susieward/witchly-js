
export default class ListItems {
  el = 'list-items'

  static get observedAttributes() {
    return ['items']
  }

  connectedCallback() {
    this.$emit('message', 'hello from a child component!')
  }

  get template() {
    return (
      <div>
        <ul>
          {this.currentItems}
        </ul>
      </div>
    )
  }

  get currentItems() {
    const items = this.getAttribute('items')
    return items.split(',').map((item, i) => {
      return (
        <li
          data-index={i}
          onclick={() => this.$emit('removed', i)}>
          {item} {i}
        </li>
      )
    })
  }
}
