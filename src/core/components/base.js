import AttrHandler from './attr-handler'
import { parse } from '../parser'
import { update } from './helpers/reactivity'
import { initOptions } from './helpers/options'
import { initStyles } from './helpers/styles'

class BaseComponent extends AttrHandler {
  get componentStyles() {
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
    this.#_render().catch(err => console.error(err))
  }

  async #_render() {
    this.attachShadow({ mode: 'open' })
    await this.#_initOptions()
    if (this._options.createdCallback) {
      await Promise.resolve(this._options.createdCallback.call(this))
    }
    const el = await this._parse()
    if (!this.shadowRoot.firstElementChild) {
      this.shadowRoot.append(el)
    } else {
      this.shadowRoot.firstElementChild.replaceWith(el)
    }
    if (this._options.connectedCallback) {
      await Promise.resolve(this._options.connectedCallback.call(this))
    }
  }

  async #_initOptions() {
    initOptions(this, this.#_update)
    if (!this.componentStyles) {
      const styleSheets = await initStyles(this, this.styles, window.document)
      this.constructor.styleSheets = styleSheets
    }
    if (this.componentStyles.length > 0) {
      this.shadowRoot.adoptedStyleSheets = this.componentStyles
    }
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
    await this.#_update(name, newVal, oldVal).catch(err => console.error(err))
    if (this._options.attributeChangedCallback) {
      this._options.attributeChangedCallback.call(this, name, oldVal, newVal)
    }
    this.#_triggerWatcher(name, newVal, oldVal)
  }

  async #_update(prop, newVal, oldVal) {
    if (!this.shadowRoot?.firstChild) return
    await update(prop, newVal, oldVal, this).catch(err => console.error(err))
    this.#_triggerWatcher(prop, newVal, oldVal)
  }

  async _parse() {
    return parse(this.template, this).catch(err => console.error(err))
  }

  #_triggerWatcher(prop, newVal, oldVal) {
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

export default BaseComponent
