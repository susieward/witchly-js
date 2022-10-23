
export default class ListItems {
  name = 'list-items'
  message = ''
  watch = {
    message: {
      handler(newVal) {
        this.$emit('message', newVal)
      }
    },
    items: {
      handler(newVal, oldVal) {
        console.log(newVal, oldVal)
      }
    }
  }

  static get observedAttributes() {
    return ['items']
  }

  connectedCallback() {
    this.message = 'hello from a child component!'
  }

  disconnectedCallback() {
    this.message = 'bye!'
  }

  render() {
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
          {item} {i}
        </li>
      )
    })
  }
}
