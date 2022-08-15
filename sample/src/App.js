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
            <Sidenav
              class="sidenav"
              onclick={(path) => this.$go(path)}
              links={links}>
            </Sidenav>
            <router-view></router-view>
          </main>
        </div>
      )
    },
    get styles() {
      return (`
        #app {
          display: grid;
          grid-row-gap: 50px;
          min-width: 100vw;
          margin: 0;
          padding: 0;
        }

        .main {
          display: grid;
          justify-content: center;
          align-content: flex-start;
          grid-template-areas: 'sidenav content';
          grid-auto-rows: auto;
          grid-column-gap: 45px;
          grid-row-gap: 20px;
          width: 100%;
          max-width: 1250px;
          min-height: auto;
          margin: 0 auto;
        }

        .sidenav {
          grid-area: sidenav;
          display: grid;
          align-content: flex-start;
          width: 260px;
          background-color: var(--content-bg-color);
          border: var(--content-border);
          border-radius: 5px;
          padding: 12px 20px;
          height: auto;
        }`
      )
    }
  }
}

export default App
