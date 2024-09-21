
export default class ListItems {
  name = 'list-items'
  state = () => ({ message: '' })
  watch = {
    message: {
      handler(newVal) {
        console.log(newVal)
        this.$emit('message', newVal)
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
    if (!Array.isArray(this.items)) return
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
