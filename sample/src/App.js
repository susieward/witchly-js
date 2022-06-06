import Header from '@/components/Header'
import Nav from '@/components/Sidenav'

export default class App {
  name = 'witchly-app'
  navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' }
  ]
  components = { Header, Sidenav: Nav(this.navLinks) }

  get template() {
    return (`
      <div id="app">
        <app-header></app-header>
        <main class="main">
          <app-sidenav></app-sidenav>
          <witchly-router></witchly-router>
        </main>
      </div>
    `)
  }
}
