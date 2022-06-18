
export default class ListItems {
  el = 'list-items'

  static get observedAttributes() {
    return ['items']
  }

  connectedCallback() {
    this.$emit('input', 'hello from a child component!')
  }

  get template() {
    return `
      <div>
        <ul>${this.list}</ul>
      </div>
    `
  }

  get currentItems() {
    return this.items.split(',')
  }

  get list() {
    return this.currentItems.map((item, i) => {
      return `
        <li data-index="${i}" onclick="$emit('removed', ${i})">
          ${item} ${i}
        </li>
      `
    }).join('')
  }
}
