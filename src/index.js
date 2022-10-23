const {
  Router,
  createComponent,
  registerComponents,
  createElementJSX,
  createFragmentJSX
} = require('./core')

class Witchly {
  #el
  #router
  static #components = {}

  static get components() {
    return this.#components
  }

  constructor(options) {
    this.#init(options).catch(err => console.error(err))
  }

  async #init(options) {
    if (options.router) {
      this.#router = new Router(options.router, this)
    }
    if (Object.values(this.constructor.components).length > 0) {
      await registerComponents(this.constructor.components, this)
    }
    const comp = await createComponent(options.render(), this)
    const el = document.getElementById(options.id)
    const newEl = new comp._ctor()
    newEl.dataset.root = true
    el.replaceWith(newEl)
    this.#el = newEl
  }

  get _el() {
    return this.#el
  }

  get router() {
    return this.#router
  }

  static component(comp) {
    this.#components[comp.name] = comp
  }
}

module.exports = Witchly
module.exports.createElementJSX = createElementJSX
module.exports.createFragmentJSX = createFragmentJSX
