import Header from './Header'
import Sidenav from './Sidenav'
import Content from './Content'

const App = {
  name: 'witchly-app',
  components: { Header, Sidenav, Content },
  get template() {
    return `
      <div id="app">
        <app-header></app-header>
        <main class="main">
          <app-sidenav></app-sidenav>
          <app-content data-text="hello from a prop!"></app-content>
        </main>
    </div>
    `
  }
}

export default App
