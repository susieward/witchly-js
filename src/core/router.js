const { registerComponent } = require('./components')

class RouterView extends HTMLElement {
  static #routes = []
  static #root = null

  static get _routes() {
    return this.#routes
  }

  static set _routes(value) {
    if (this.#routes.length === 0) {
      return this.#routes = value
    }
    return false
  }

  static get _root() {
    return this.#root
  }

  static set _root(value) {
    return !this.#root ? this.#root = value : false
  }

  #components = {}
  #location = window.location
  #history = window.history

  constructor() {
    super()
    window.onpopstate = () => {
      this._render()
    }
    this.attachShadow({ mode: 'open' })
  }

  get routes() {
    return this.constructor._routes
  }

  get currentRoute() {
    return this._match(this._path)
  }

  get _currentComponent() {
    return this.#components[this.currentRoute.name]
  }

  get _basePath() {
    return `${this.#location.protocol}//${this.#location.host}`
  }

  get _root() {
    return this.constructor._root
  }

  get _path() {
    return this.#location.pathname
  }

  get _currentComponent() {
    return this.#components[this.currentRoute.name]
  }

  connectedCallback() {
    this.push(this.currentRoute)
  }

  async _render() {
    let comp = this.#components[this.currentRoute.name]
    if (!comp) {
      comp = await registerComponent(this.currentRoute.component, this._root)
      this.#components[this.currentRoute.name] = comp
    }
    const el = new comp._ctor()
    if (this.shadowRoot.hasChildNodes()) {
      this.shadowRoot.firstChild.replaceWith(el)
    } else {
      this.shadowRoot.append(el)
    }
  }

  push(data) {
    const match = this._match(data)
    if (match) {
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
      const newPath = `${this._basePath}${match.path}`
      this.#history.pushState(routeRecord, null, newPath)
      this._render()
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
}

class WitchlyRouter {
  #root = null

  constructor({ routes }, root) {
    this.#root = root
    RouterView._routes = routes
    RouterView._root = root
    customElements.define('router-view', RouterView)
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
