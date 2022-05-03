const App = {
  name: 'witchly-app',
  get template() {
    return `<div id="app-container">
    <app-header></app-header>
    <main class="main">
      <aside class="sidenav">
      <button onclick="addListItem">
        click me to do a thing
        </button>
        <ul>
          <li>I am a list item!</li>
        </ul>
      </aside>
      <div class="content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>
    </main>
    </div>
    `
  },
  addListItem() {
    const el = this.getScopedElement('ul')
    const li = document.createElement('li')
    li.append('hello!')
    el.append(li)
  }
}

export default App
