const {
  WitchlyRouter,
  createComponent,
  createElementJSX,
  createFragmentJSX
} = require('./core')

class Witchly {
  #el = null

  constructor(options) {
    if (options.router) {
      this.router = new WitchlyRouter(options.router, this)
    }
    const comp = Witchly.component(options.render(), this)
    const el = document.getElementById(options.id)
    const newEl = new comp._ctor()
    el.replaceWith(newEl)
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
