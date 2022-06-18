const { parse } = require('./utils/parser')
const { update } = require('./utils/reactivity')
const { initOptions } = require('./utils/options')

class Base extends HTMLElement {
  constructor() {
    super()
    initOptions(this._options, this, this.#update)
    if (this._options.createdCallback) {
      this._options.createdCallback.call(this)
    }
  }

  get _domTemplate() {
    return parse(this.template, this)
  }

  get $router() {
    return this._root?.router
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' })
    _initStyles(this)
    this.shadowRoot.append(this._domTemplate)
  }

  attributeChangedCallback(name, oldVal, newVal) {
    this.#update(name, newVal, oldVal)
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

function _initStyles(vm) {
  let styles = []
  if (vm._options.styles) {
    styles.push(vm._options.styles)
  }
  if (document.styleSheets.length > 0) {
    const docStyles = [...document.styleSheets].map(s => s.ownerNode.innerText)
    styles.push(...docStyles)
  }
  if (styles.length > 0) {
    const constructedStyles = styles.map(cssText => {
      const styleSheet = new CSSStyleSheet()
      styleSheet.replaceSync(cssText)
      return styleSheet
    })
    vm.shadowRoot.adoptedStyleSheets = constructedStyles
  }
}

module.exports = Base
