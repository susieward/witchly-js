const RouterView = require('./view')

class Router {
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

module.exports = Router
