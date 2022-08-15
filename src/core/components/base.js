const { parse } = require('../parser')
const { update } = require('./helpers/reactivity')
const { initOptions } = require('./helpers/options')
const staticAttrs = ['data-id', 'data-root']

class BaseComponent extends HTMLElement {
  get $router() {
    return this._root?.router || this.$root.$router
  }

  get $root() {
    return this._root?._el || document.querySelector('[data-root=true]')
  }

  connectedCallback() {
    this.#render().catch(err => console.error(err))
  }

  async #render() {
    this.attachShadow({ mode: 'open' })
    initOptions(this._options, this, this.#update)
    if (this._options.createdCallback) {
      this._options.createdCallback.call(this)
    }
    const dom = await this._parse()
    this.shadowRoot.append(dom)
    if (this._options.connectedCallback) {
      this._options.connectedCallback.call(this)
    }
  }

  disconnectedCallback() {
    if (this._options.disconnectedCallback) {
      this._options.disconnectedCallback.call(this)
    }
  }

  async attributeChangedCallback(name, oldVal, newVal) {
    if (!this.isConnected) return
    newVal = _parseValue(newVal)
    oldVal = _parseValue(oldVal)
    await this.#update(name, newVal, oldVal)
    if (this._options.attributeChangedCallback) {
      this._options.attributeChangedCallback.call(this, name, oldVal, newVal)
    }
  }

  async #update(prop, newVal, oldVal) {
    if (!this.shadowRoot?.firstChild) return
    try {
      await update(prop, newVal, oldVal, this)
      if (this.watch && this.watch[prop]) {
        this.watch[prop].handler.call(this, newVal, oldVal)
      }
    } catch (err) {
      console.error(err)
    }
  }

  _parse() {
    return parse(this.template, this).catch(err => console.error(err))
  }

  getAttribute(attr) {
    const val = super.getAttribute(attr)
    return _parseValue(val)
  }

  setAttribute(attr, newVal) {
    if (staticAttrs.includes(attr) && this.hasAttribute(attr)) {
      throw new Error(`Cannot redefine static attribute: ${attr}`)
    }
    const val = (newVal?.constructor?.name !== 'String')
      ? JSON.stringify(newVal)
      : newVal?.toString() || ''
    return super.setAttribute(attr, val)
  }

  removeAttribute(attr) {
    if (staticAttrs.includes(attr)) {
      throw new Error(`Cannot remove static attribute: ${attr}`)
    }
    return super.removeAttribute(attr)
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

function _parseValue(value) {
  try {
    const parsed = JSON.parse(value)
    value = parsed
  } catch {
    // no-op
  }
  return value
}

module.exports = BaseComponent
