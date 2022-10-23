const RouterView = require('./view')

class Router {
  #root
  #routes = []

  constructor({ routes }, root) {
    this.#root = root
    this.#routes = routes
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
    return this.#root._el
  }

  get view() {
    return this.el?.shadowRoot?.querySelector('router-view')
  }

  get routes() {
    return this.#routes
  }

  push(data) {
    return this.view.push(data).catch(err => console.error(err))
  }
}

module.exports = Router
