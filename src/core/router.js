const { registerComponent } = require('./component')

class View extends HTMLElement {
  basePath = `${location.protocol}//${location.host}/#`
  components = {}

  get currentRoute() {
    const path = location.hash.substring(1) || location.pathname
    return this.match(path)
  }

  connectedCallback() {
    this.render()
  }

  async render() {
    let comp = this.components[this.currentRoute.name]
    if (!comp) {
      const root = { router: this }
      comp = await registerComponent(this.currentRoute.component, root)
      this.components[this.currentRoute.name] = comp
    }
    const ctor = comp.ctor
    if (this.shadowRoot.hasChildNodes()) {
      this.shadowRoot.firstChild.replaceWith(new ctor())
    } else {
      this.shadowRoot.append(new ctor())
    }
  }

  routeChanged() {
    this.render()
  }

  match(path) {
    return this.routes.find(r => r.path === path)
  }

  push(data) {
    if (typeof data === 'string' && data.startsWith('/')) {
      return location.assign(`${this.basePath}${data}`)
    }
    if (typeof data === "object") {
      let matched = this.routes.find(r => r.path === data.path)
      if (!matched) throw new Error(`Router: push: Path for route record could not be found`)
      else return location.assign(`${this.basePath}${matched.path}`)
    }
  }
}

class Router {
  constructor({ routes }){
    this.routes = routes || []
    createView(this.routes)
  }

  get view() {
    const app = document.querySelector('witchly-app')
    return app.shadowRoot.querySelector('witchly-router')
  }

  push(data) {
    return this.view.push(data)
  }
}

function createView(routes) {
  class RouterView extends View {
    constructor() {
      super()
      this.routes = routes
      if (location.pathname === '/') {
        location.assign(`${this.basePath}/`)
      }
      window.onhashchange = () => {
        setTimeout(this.routeChanged(), 0)
      }
      this.attachShadow({ mode: 'open' })
    }
  }
  customElements.define('witchly-router', RouterView)
}

module.exports = Router
