
export default class ListItems {
  el = 'list-items'
  message = 'hello from a child component!'

  static get observedAttributes() {
    return ['items']
  }

  connectedCallback() {
    this.$emit('message', this.message)
  }

  get template() {
    return (
      <div>
        {this.items ? <ul>{this.currentItems}</ul> : ''}
      </div>
    )
  }

  get currentItems() {
    return this.items.split(',').map((item, i) => {
      return (
        <li
          data-index={i}
          onclick={() => this.$emit('remove', i)}>
          {item} {i}
        </li>
      )
    })
  }
}
