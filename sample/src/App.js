const Header = () => import('@/components/Header')

export default function App() {
  this.name = 'witchly-app'
  this.components = { Header }

  return {
    ...this,
    get template() {
      return `
          <div id="app">
            <app-header></app-header>
            <witchly-router></witchly-router>
          </div>
      `
    }
  }
}
