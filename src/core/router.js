const { registerComponent } = require('./components')

class RouterView extends HTMLElement {
  #components = {}

  constructor() {
    super()
    window.onpopstate = () => {
      this.#render()
    }
    this.attachShadow({ mode: 'open' })
  }

  get history() {
    return window.history
  }

  get location() {
    return window.location
  }

  get currentRoute() {
    return this._match(this._path)
  }

  get _currentComponent() {
    return this.#components[this.currentRoute.name]
  }

  get _basePath() {
    return `${this.location.protocol}//${this.location.host}`
  }

  get _path() {
    return this.location.pathname
  }

  connectedCallback() {
    this.#render()
  }

  async #render() {
    if (!this._currentComponent) {
      const comp = await registerComponent(this.currentRoute.component, this._root)
      this.#components[this.currentRoute.name] = comp
    }
    const el = new this._currentComponent._ctor()
    if (this.shadowRoot.hasChildNodes()) {
      this.shadowRoot.firstChild.replaceWith(el)
    } else {
      this.shadowRoot.append(el)
    }
  }

  push(data) {
    const match = this._match(data)
    if (match) {
      const routeRecord = this._buildRouteRecord(match)
      const newPath = `${this._basePath}${match.path}`
      this.history.pushState(routeRecord, null, newPath)
      this.#render()
    } else {
      throw new Error(`Router: push: Path for route record could not be found`)
    }
  }

  _match(data) {
    let path
    if (typeof data === 'string' && (data.startsWith('/'))) {
      path = data
    } else if (typeof data === 'object') {
      path = data?.path
    }
    return this.routes.find(r => r.path === path)
  }

  _buildRouteRecord(match) {
    const routeRecord = {
      prev: {
        name: this.currentRoute.name,
        path: this.currentRoute.path,
        component: this._currentComponent?.name,
        fullPath: `${this._basePath}${this.currentRoute.path}`
      },
      name: match.name,
      path: match.path,
      fullPath: `${this._basePath}${match.path}`
    }
    return routeRecord
  }
}

class WitchlyRouter {
  #root = null

  constructor({ routes }, root) {
    this.#root = root
    customElements.define('router-view',
      class extends RouterView {
        get routes() {
          return routes
        }

        get _root() {
          return root
        }
      }
    )
  }

  get #view() {
    const app = this.#root._el
    return app.shadowRoot.querySelector('router-view')
  }

  push(data) {
    return this.#view.push(data)
  }
}

module.exports = WitchlyRouter
