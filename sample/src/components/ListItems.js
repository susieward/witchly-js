
const ListItems = {
  name: 'list-items',
  data: () => ({
    currentItems: []
  }),
  get list() {
    return [...this.currentItems.map((item, i) => {
      return `<li data-index="${i}" onclick="remove">
        ${item} ${i}
      </li>`
    })].join('')
  },
  get template() {
    const content = (this.currentItems.length > 0)
      ? `<ul>
          ${this.list}
        </ul>`
      : `<ul></ul>`

    return `<div>${content}</div>`
  },
  connected() {
    this.currentItems = this.items.split(',')
  },
  remove(e, vm) {
    const i = e.target.dataset.index
    this.$emit('removed', Number(i))
  }
}

export default ListItems
