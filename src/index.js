const {
  Router,
  createComponent,
  createElementJSX,
  createFragmentJSX
} = require('./core')

class Witchly {
  #el = null

  constructor(options) {
    if (options.router) {
      this.router = new Router(options.router, this)
    }
    const comp = Witchly.component(options.render(), this)
    const el = document.getElementById(options.id)
    el.replaceWith(new comp._ctor())
    this.#el = document.querySelector(`${comp.name}`)
  }

  get _el() {
    return this.#el
  }

  static component(options, root) {
    return createComponent(options, root)
  }
}

module.exports = Witchly
module.exports.createElementJSX = createElementJSX
module.exports.createFragmentJSX = createFragmentJSX
