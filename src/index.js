const {
  Router,
  createComponent,
  createElementJSX,
  createFragmentJSX
} = require('./core')

class Witchly {
  #el

  constructor(options) {
    this.#init(options)
  }

  async #init(options) {
    if (options.router) {
      this.router = new Router(options.router, this)
    }
    const comp = await Witchly.component(options.render(), this)
    const el = document.getElementById(options.id)
    const newEl = new comp._ctor()
    newEl.dataset.root = true
    el.replaceWith(newEl)
    this.#el = newEl
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
