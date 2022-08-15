const RouterView = require('./view')

class Router {
  #root

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

  get #el() {
    return this.#root._el
  }

  get #view() {
    return this.#el.shadowRoot.querySelector('router-view')
  }

  push(data) {
    return this.#view.push(data)
  }
}

module.exports = Router
