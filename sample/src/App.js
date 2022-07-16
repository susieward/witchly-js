import Header from '@/components/Header'
const Sidenav = await import('@/components/Sidenav')

const App = () => {
  const name = 'witchly-app'
  const components = { Header }

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Examples', path: '/examples' },
    { name: 'About', path: '/about' }
  ]

  return {
    name,
    components,
    get template() {
      return (
        <div id="app">
          <app-header></app-header>
          <main class="main">
            <Sidenav vm={this} links={links}>
              <button onclick={() => this.hi()}>
                hi
              </button>
            </Sidenav>
            <router-view></router-view>
          </main>
        </div>
      )
    },
    hi() {
      this.$querySelector('aside').appendChild(<span>hi</span>)
    }
  }
}

export default App
