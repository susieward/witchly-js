
const App = async () => {
  const links = [
    { name: 'Home', path: '/' },
    { name: 'Examples', path: '/examples', params: { show: 3 }},
    { name: 'About', path: '/about' },
    { name: 'Test', params: { id: 'blah' } }
  ]

  const [Sidenav] = await Promise.all([
    import('@/components/Sidenav'),
    import('./main.css')
  ])

  return {
    name: 'witchly-app',
    components: {
      Header: () => import('@/components/Header')
    },
    createdCallback() {
      this.$store.dispatch('updateMessage', 'hello').then(() => {
        this.$store.dispatch('updateMessage', 'bye')
      })
    },
    render() {
      return (
        <div id="app">
          <app-header propTest="hi"></app-header>
          {this.message}
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
    get message() {
      return this.$store.state.message
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
        }

        h1 {
          font-weight: 300;
          padding: 0;
          margin: 0;
          font-size: 28px;
          letter-spacing: 0.03em;
        }

        h2 {
          font-weight: 300;
          padding: 0;
          margin: 0;
          font-size: 20px;
          letter-spacing: 0.03em;
          line-height: 32px;
        }

        button {
          background-color: #fff;
          border: none;
          border: 1px solid var(--accent-color);
          border-radius: 5px;
          color: var(--accent-color);
          padding: 6px 10px;
          font-family: var(--font-family);
          font-size: 16px;
          cursor: pointer;
          width: auto;
        }

        input[type=text] {
          background-color: #fff;
          border: none;
          border: var(--content-border);
          border-radius: 5px;
          color: var(--text-color);
          padding: 6px 10px;
          font-family: var(--font-family);
          font-size: 16px;
        }`
      )
    }
  }
}

export default App
