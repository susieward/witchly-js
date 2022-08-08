const {
  Router,
  createComponent,
  createElementJSX,
  createFragmentJSX
} = require('./core')

class Witchly {
  constructor(options) {
    if (options.router) {
      this.router = new Router(options.router, this)
    }
    const comp = Witchly.component(options.render(), this)
    const el = document.getElementById(options.id)
    const newEl = new comp._ctor()
    newEl.dataset.root = true
    el.replaceWith(newEl)
  }

  get _el() {
    return document.querySelector('[data-root=true]')
  }

  static component(options, root) {
    return createComponent(options, root)
  }
}

module.exports = Witchly
module.exports.createElementJSX = createElementJSX
module.exports.createFragmentJSX = createFragmentJSX
