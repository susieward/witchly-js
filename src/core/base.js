const { parse } = require('./utils/parser')
const { update } = require('./utils/reactivity')

class Base extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  get _domTemplate() {
    return this.#_parse(this._template)
  }

  get _template() {
    return this.template
  }

  render() {
    const style = document.styleSheets[0].ownerNode
    this.shadowRoot.append(this._domTemplate, style.cloneNode(true))
    if (this.connected) {
      this.#onConnected()
    }
  }

  $emit(evtName, ...args) {
    const evt = new CustomEvent(evtName, {
      bubbles: true,
      composed: true,
      detail: args.length === 1 ? args[0] : args
    })
    return this.dispatchEvent(evt)
  }

  $append(...args) {
    this.shadowRoot.append(...args)
  }

  $querySelector(...args) {
    return this.shadowRoot.querySelector(...args)
  }

  async #onConnected() {
    const undefinedElements = this.shadowRoot.querySelectorAll(':not(:defined)')
    const promises = [...undefinedElements].map(el => {
      return customElements.whenDefined(el.localName)
    })
    await Promise.all(promises)
    this.connected.apply(this, [this])
  }

  _update(prop, newVal, oldVal) {
    return update(prop, newVal, oldVal, this)
  }

  #_parse(val, context = this) {
    return parse(val, context)
  }
}

module.exports = Base
