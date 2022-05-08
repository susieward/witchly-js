
export default function Sidenav() {
  this.name = 'app-sidenav'
  this.data = function() {
    return {
      items: ['I am a list item!']
    }
  }

  this.addListItem = function() {
    this.items.push('hello!')
  }

  return {
    ...this,
    get template() {
      return `
        <aside class="sidenav">
          <button onclick="addListItem">
            click me
          </button>
          <ul>
            ${[...this.items.map(item => `<li>${item}</li>`)].join('')}
          </ul>
        </aside>
      `
    }
  }
}
