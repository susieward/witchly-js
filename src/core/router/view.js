const { createComponent } = require('../components')

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
    return _match(this._path, this.routes)
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
    this.#render().catch(err => console.error(err))
  }

  async #render() {
    if (!this._currentComponent) {
      const comp = await createComponent(this.currentRoute.component, this._root)
      this.#components[this.currentRoute.name] = comp
    }
    const el = new this._currentComponent._ctor()
    if (!this.shadowRoot.firstChild) {
      return this.shadowRoot.append(el)
    }
    this.shadowRoot.firstChild.replaceWith(el)
  }

  async push(data) {
    const match = _match(data, this.routes)
    if (!match) {
      throw new Error(`Router: Path for route record could not be found`)
    }
    const routeRecord = _buildRouteRecord(match, this)
    const newPath = `${this._basePath}${match.path}`
    this.history.pushState(routeRecord, null, newPath)
    await this.#render().catch(err => console.error(err))
  }
}

function _match(data, routes) {
  let path
  if (typeof data === 'string' && (data.startsWith('/'))) {
    path = data
  } else if (typeof data === 'object') {
    path = data?.path
  }
  return routes.find(r => r.path === path)
}

function _buildRouteRecord(match, vm) {
  const { name, path } = vm.currentRoute
  const routeRecord = {
    prev: {
      name,
      path,
      component: vm._currentComponent?.name,
      fullPath: `${vm._basePath}${path}`
    },
    name: match.name,
    path: match.path,
    fullPath: `${vm._basePath}${match.path}`
  }
  return routeRecord
}

module.exports = RouterView
