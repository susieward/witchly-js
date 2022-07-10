const { parse, update, initOptions, initStyles } = require('./utils')

class Base extends HTMLElement {
  constructor() {
    super()
    initOptions(this._options, this, this.#_update)
    if (this._options.createdCallback) {
      this._options.createdCallback.call(this)
    }
  }

  get $router() {
    return this._root?.router
  }

  connectedCallback() {
    this.#_render()
  }

  attributeChangedCallback(name, oldVal, newVal) {
    this.#_update(name, newVal, oldVal)
  }

  async #_render() {
    this.attachShadow({ mode: 'open' })
    initStyles(this, document)
    const dom = await parse(this.template, this)
    this.shadowRoot.append(dom)
    if (this._options.connectedCallback) {
      this._options.connectedCallback.call(this)
    }
  }

  #_update(prop, newVal, oldVal) {
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

  $querySelector(...args) {
    return this.shadowRoot.querySelector(...args)
  }

  $querySelectorAll(...args) {
    return this.shadowRoot.querySelectorAll(...args)
  }

  $go(args) {
    return this.$router.push(args)
  }
}

module.exports = Base
