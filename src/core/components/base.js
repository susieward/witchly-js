import AttrHandler from './attr-handler'
import { parse } from '../parser'
import { updateDOM } from './helpers/reactivity'
import { initOptions } from './helpers/options'
import { initStyles } from './helpers/styles'

class BaseComponent extends AttrHandler {
  get _componentStyles() {
    return this.constructor.styleSheets
  }

  get _isRoot() {
    return this.dataset?.root === 'true'
  }

  get $root() {
    return this._parent?._el || document.querySelector('[data-root=true]')
  }

  get $router() {
    return this._isRoot ? this._parent?._router : this.$root?.$router
  }

  get $route() {
    return this.$router?.view?._route
  }

  get $store() {
    return this._isRoot ? this._parent?._store : this.$root?.$store
  }

  connectedCallback() {
    this.#render().catch(err => console.error(err))
  }

  async #render() {
    this.attachShadow({ mode: 'open', clonable: true })
    initOptions(this, this.#update)
    _setStyles(this, window.document)
    if (this._options.createdCallback) {
      await Promise.resolve(this._options.createdCallback.call(this, this))
    }
    const el = await this._parse()
    if (!this.shadowRoot.firstElementChild) {
      this.shadowRoot.append(el)
    } else {
      this.shadowRoot.firstElementChild.replaceWith(el)
    }
    if (this._options.connectedCallback) {
      await Promise.resolve(this._options.connectedCallback.call(this, this))
    }
  }

  _parse() {
    return parse(this.template, this)
  }

  disconnectedCallback() {
    if (this._options.disconnectedCallback) {
      this._options.disconnectedCallback.call(this)
    }
  }

  async attributeChangedCallback(name, oldVal, newVal) {
    if (!this.isConnected) return
    newVal = this._parseValue(newVal)
    oldVal = this._parseValue(oldVal)
    await this.#update(name, newVal, oldVal).catch(err => console.error(err))
    if (this._options.attributeChangedCallback) {
      this._options.attributeChangedCallback.call(this, name, oldVal, newVal)
    }
    if (this.watch && this.watch[name]) {
      this.watch[name].handler.call(this, newVal, oldVal)
    }
  }

  async #update(prop, newVal, oldVal) {
    if (!this.shadowRoot?.firstElementChild) return
    await updateDOM(prop, newVal, oldVal, this).catch(err => console.error(err))
    if (this.watch && this.watch[prop]) {
      this.watch[prop].handler.call(this, newVal, oldVal)
    }
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

function _setStyles(vm, doc) {
  if (!vm._componentStyles) {
    const styleSheets = initStyles(vm, doc)
    vm.constructor.styleSheets = styleSheets
  }
  if (vm._componentStyles.length > 0) {
    vm.shadowRoot.adoptedStyleSheets = vm._componentStyles
  }
}

export default BaseComponent
