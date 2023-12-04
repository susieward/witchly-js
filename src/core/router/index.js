import RouterView from './view'

class Router {
  _root
  _routes = []

  constructor({ routes }, root) {
    this._root = root
    this._routes = routes
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

  get el() {
    return this._root._el
  }

  get view() {
    return this.el?.shadowRoot?.querySelector('router-view')
  }

  get routes() {
    return this._routes
  }

  push(data) {
    return this.view.push(data).catch(err => console.error(err))
  }
}

export default Router
