const {
  Router,
  StateManager,
  MapItems,
  createComponent,
  registerComponents,
  createElementJSX,
  createFragmentJSX
} = require('./core')

class Witchly {
  #el
  #router
  #store
  static #components = {}

  static get _components() {
    return this.#components
  }

  constructor(options) {
    this.#init(options).catch(err => console.error(err))
  }

  async #init(options) {
    MapItems.define()
    if (options.router) {
      this.#router = new Router(options.router, this)
    }
    if (options.store) {
      this.#store = new StateManager(options.store)
    }
    if (Object.values(this.constructor._components).length > 0) {
      await registerComponents(this.constructor._components, this)
    }
    await this.#initEl(options)
  }

  async #initEl(options) {
    const comp = await createComponent(options.render(), this)
    const el = document.getElementById(options.id)
    const newEl = new comp._ctor()
    newEl.dataset.root = true
    Object.defineProperty(newEl, '_parent', {
      value: this,
      enumerable: true,
      configureable: false,
      writeable: false
    })
    el.replaceWith(newEl)
    this.#el = newEl
  }

  get _el() {
    return this.#el
  }

  get _router() {
    return this.#router
  }

  get _store() {
    return this.#store
  }

  static component(comp) {
    this.#components[comp.name] = comp
  }

  static components(comps) {
    return comps.forEach(comp => this.component(comp))
  }
}

module.exports = Witchly
module.exports.createElementJSX = createElementJSX
module.exports.createFragmentJSX = createFragmentJSX
