
const App = async () => {
  const Sidenav = await import('@/components/Sidenav')
  const links = [
    { name: 'Home', path: '/' },
    { name: 'Examples', path: '/examples', params: { show: 3 }},
    { name: 'About', path: '/about' },
    { name: 'Test', params: { id: 'blah' } }
  ]

  return {
    name: 'WitchlyApp',
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
          <main class="main">
            <Sidenav
              onclick={(path) => this.$go(path)}
              links={links}>
            </Sidenav>
            <div class="wrapper">
              <router-view></router-view>
              {this.message}
            </div>
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
          grid-template-rows: auto 1fr;
          margin: 0;
          padding: 0;
        }
        
        .main {
          display: grid;
          height: 100%;
          width: 100%;
          max-width: 1250px;
          margin: 30px auto 0 auto;
          grid-template-columns: 200px 1fr;
        }
        
        .wrapper {
          display: grid;
        }
        
        h1 {
          font-weight: 300;
          padding: 0;
          margin: 0;
          font-size: 28px;
          letter-spacing: 0.03em;
        }
        
        h2 {
          font-weight: 600;
          font-style: normal;
          font-size: 24px;
          margin: 0 0 16px 0;
          letter-spacing: -.02em;
          line-height: 32px;
          color: var(--text-color)
        }
        
        h4 {
          margin: 0 0 12px 0;
          letter-spacing: -.01em;
          color: var(--text-color-light)
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
