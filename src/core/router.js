const ComponentFactory = require('./component')

class WitchlyRouter extends HTMLElement {
  static _routes = []
  static _root = null

  static get routes() {
    return this._routes
  }

  static get root() {
    return this._root
  }

  #components = {}

  constructor() {
    super()
    window.onpopstate = () => {
      this._render()
    }
    this.attachShadow({ mode: 'open' })
  }

  get routes() {
    return this.constructor.routes
  }

  get currentRoute() {
    return this._match(this._path)
  }

  get #location() {
    return window.location
  }

  get #history() {
    return window.history
  }

  get _basePath() {
    return `${this.#location.protocol}//${this.#location.host}`
  }

  get _root() {
    return this.constructor.root
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
      comp = await ComponentFactory.registerComponent(this.currentRoute.component, this._root)
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

class Router {
  constructor({ routes }, root){
    WitchlyRouter._routes = routes
    WitchlyRouter._root = root
    customElements.define('witchly-router', WitchlyRouter)
  }

  get #view() {
    const app = document.querySelector('witchly-app')
    return app.shadowRoot.querySelector('witchly-router')
  }

  push(data) {
    return this.#view.push(data)
  }
}

module.exports = Router
