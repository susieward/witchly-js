const { parse } = require('./parser-utils')

class Base extends HTMLElement {
  constructor() {
    super()
    this.loaded = false
  }

  connectedCallback() {
    this.$render()
  }

  clear() {
    this.replaceChildren()
  }

  $render() {
    if (this.loaded) this.clear()
    const val = this._template || this.ast
    const el = this.parse(val)
    this.append(el)
    if (!this.loaded) this.loaded = true
  }

  getElement(selector) {
    return document.querySelector(selector)
  }

  getScopedElement(selector) {
    return this.querySelector(selector)
  }

  parse(val, context = this) {
    return parse(val, context)
  }

  inject(dep, parentEl) {
    if (!dep) throw new Error('Dependency must be defined')
    if (!parentEl) parentEl = this.firstChild

    let resolvedDep = null

    if (typeof dep === 'string') {
      // attempt to look up custom element definition
      const ctor = customElements.get(dep)
      if (ctor) {
        resolvedDep = new ctor()
      }
    } else if (Array.isArray(dep)) {
      return dep.forEach(item => {
        return this.inject(item, parentEl)
      })
    } else if (typeof dep === 'object') {
      resolvedDep = this.parse(dep)
    } else if (typeof dep === 'function') {
      resolvedDep = dep()
    }
    if (!resolvedDep) throw new Error('Could not resolve dependency')
    try {
      parentEl.append(resolvedDep)
    } catch (err) {
      throw err
    }
  }
}

module.exports = Base
