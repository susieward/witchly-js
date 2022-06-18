import Header from '@/components/Header'
import Sidenav from '@/components/Sidenav'

const App = () => {
  const el = 'witchly-app'
  const links = [
    { name: 'Home', path: '/' },
    { name: 'Examples', path: '/examples' },
    { name: 'About', path: '/about' }
  ]
  return {
    el,
    components: { Header },
    get template() {
      return (
        <div id="app">
          <app-header></app-header>
          <main class="main">
            <button onclick={() => this.hello()}>hello</button>
            <Sidenav vm={this} links={links}></Sidenav>
            <router-view></router-view>
          </main>
        </div>
      )
    },
    hello() {
      return console.log(this.localName)
    }
  }
}

export default App
