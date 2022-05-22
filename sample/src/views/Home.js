const Sidenav = () => import('@/components/Sidenav')
const Content = () => import('@/components/Content')

export default class Home {
  constructor() {
    this.name = 'home-view'
    this.text = 'Hello from a static prop!'
    this.components = { Sidenav, Content }
  }

  created() {
    this.className = 'main'
  }

  get template() {
    return `
        <main class="main">
          <app-sidenav></app-sidenav>
          <app-content data-if="${this.isConnected}" data-text="${this.text}"></app-content>
        </main>
    `
  }
}
