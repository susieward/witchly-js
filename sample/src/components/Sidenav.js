const ListItems = () => import('./ListItems')

export default function Sidenav() {
  this.name = 'app-sidenav'
  this.components = { ListItems }

  this.data = () => ({
    items: ['test']
  })

  this.addListItem = function(e, vm, text = 'hello!') {
    this.items.push(text)
  }

  this.updateItems = function(e) {
    const index = e.detail
    this.items.splice(index, 1)
  }

  return {
    ...this,
    connected() {
      this.addListItem()
    },
    get template() {
      return `
          <aside class="sidenav">
            <button onclick="addListItem">
              click me
            </button>
            <list-items
              onremoved="updateItems"
              data-items="${this.items}">
            </list-items>
          </aside>
      `
    }
  }
}
