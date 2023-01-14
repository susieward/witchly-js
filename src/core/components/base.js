const AttrHandler = require('./attr-handler')
const { parse } = require('../parser')
const { update } = require('./helpers/reactivity')
const { initOptions } = require('./helpers/options')

class BaseComponent extends AttrHandler {
  _constructedStyles = []

  get _isRoot() {
    return this.dataset?.root === 'true'
  }

  get $root() {
    return this._parent?._el || document.querySelector('[data-root=true]')
  }

  get $router() {
    return this._parent?._router || this.$root?.$router
  }

  get $route() {
    return this.$router?.view?._route
  }

  get $store() {
    return this._parent?._store || this.$root?.$store
  }

  connectedCallback() {
    this.#_render().catch(err => console.error(err))
  }

  async #_render() {
    this.attachShadow({ mode: 'open' })
    await initOptions(this, this.#_update, window.document)
    if (this._options.createdCallback) {
      await Promise.resolve(this._options.createdCallback.call(this))
    }
    const dom = await this._parse()
    if (Array.isArray(dom)) {
      this.shadowRoot.append(...dom)
    } else {
      this.shadowRoot.append(dom)
    }
    if (this._options.connectedCallback) {
      await Promise.resolve(this._options.connectedCallback.call(this))
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
  }

  async #_update(prop, newVal, oldVal) {
    if (!this.shadowRoot?.firstChild) return
    await update(prop, newVal, oldVal, this).catch(err => console.error(err))
    if (this.watch && this.watch[prop]) {
      this.watch[prop].handler.call(this, newVal, oldVal)
    }
  }

  _parse() {
    return parse(this.template, this).catch(err => console.error(err))
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

module.exports = BaseComponent
