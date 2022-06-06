const { parse } = require('./utils/parser')
const { update } = require('./utils/reactivity')

class Base extends HTMLElement {
  get _domTemplate() {
    return parse(this.template, this)
  }

  get $router() {
    return this._root?.router
  }

  connectedCallback() {
    this._render()
  }

  attributeChangedCallback(name, oldVal, newVal) {
    this._update(name, newVal, oldVal)
  }

  _render() {
    this.shadowRoot.append(this._domTemplate)
  }

  _update(prop, newVal, oldVal) {
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
