
const App = async () => {
  const name = 'witchly-app'
  const Sidenav = await import('@/components/Sidenav')
  const components = { Header: () => import('@/components/Header') }
  
  const links = [
    { name: 'Home', path: '/' },
    { name: 'Examples', path: '/examples', params: { show: 3 }},
    { name: 'About', path: '/about' },
    { name: 'Test', params: { id: 'test-id' } }
  ]

  const createdCallback = (vm) => {
    vm.$store.dispatch('updateMessage', 'message: hello').then(() => {
      vm.$store.dispatch('updateMessage', 'message: bye')
    })
  }
  
  const render = (vm) => {
    return (
      <div id="app">
        <Sidenav
          onclick={(path) => vm.$go(path)}
          links={links}>
          <h1>witchly.js</h1>
        </Sidenav>
        <main>
          <app-header message={vm.$store.state.message}></app-header>
          <router-view class="wrapper"></router-view>
        </main>
      </div>
    )
  }

  return { name, components, render, createdCallback }
}

export default App
