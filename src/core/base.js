const { parse } = require('./utils/parser')
const { update } = require('./utils/reactivity')
const { initOptions } = require('./utils/options')

class Base extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.#init()
  }

  get $router() {
    return this._root?.router
  }

  get $root() {
    return this._root._el
  }

  #init() {
    try {
      initOptions(this._options, this, this.#update)
      if (this._options.createdCallback) {
        this._options.createdCallback.call(this)
      }
    } catch(err) {
      console.error(err)
    }
  }

  connectedCallback() {
    return this.#render().catch(e => console.error(e))
  }

  attributeChangedCallback(name, oldVal, newVal) {
    this.#update(name, newVal, oldVal)
  }

  async #render() {
    const dom = await parse(this.template, this)
    this.shadowRoot.append(dom)
    if (this._options.connectedCallback) {
      this._options.connectedCallback.call(this)
    }
  }

  #update(prop, newVal, oldVal) {
    return update(prop, newVal, oldVal, this)
  }

  $emit(evtName, ...args) {
    const evt = new CustomEvent(evtName, {
      bubbles: true,
      composed: true,
      detail: args?.length === 1 ? args[0] : args
    })
    return this.dispatchEvent(evt)
  }

  $append(...args) {
    return this.shadowRoot.append(...args)
  }

  $appendChild(el) {
    return this.shadowRoot.appendChild(el)
  }

  $querySelector(arg) {
    return this.shadowRoot.querySelector(arg)
  }

  $querySelectorAll(arg) {
    return this.shadowRoot.querySelectorAll(arg)
  }

  $go(args) {
    return this.$router.push(args)
  }
}

module.exports = Base
