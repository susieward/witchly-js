import Header from '@/components/Header'
const Sidenav = await import('@/components/Sidenav')

const App = () => {
  const name = 'witchly-app'
  const components = { Header }

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Examples', path: '/examples' },
    { name: 'About', path: '/about' },
    { name: 'Test', params: { id: 'blah' } }
  ]

  return {
    name,
    components,
    render() {
      return (
        <div id="app">
          <app-header propTest="hi"></app-header>
          <main class="main">
            <Sidenav
              onclick={(path) => this.$go(path)}
              links={links}>
            </Sidenav>
            <router-view></router-view>
          </main>
        </div>
      )
    },
    get styles() {
      return (
        `#app {
          display: grid;
          grid-row-gap: 50px;
          min-width: 100vw;
          margin: 0;
          padding: 0;
        }

        .main {
          display: grid;
          grid-template-columns: minmax(100px, 20%) 1fr;
          grid-row-gap: 20px;
          grid-column-gap: 2rem;
          width: 100%;
          max-width: 1250px;
          min-height: auto;
          margin: 0 auto;
        }`
      )
    }
  }
}

export default App
