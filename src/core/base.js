class Base extends HTMLElement {
  static _ast = null
  static _renderFn = null

  static get ast() {
    return this._ast
  }

  static set ast(newVal) {
    return this._ast = newVal
  }

  static get renderFn() {
    return this._renderFn
  }

  static set renderFn(newVal) {
    return this._renderFn = newVal
  }

  get classRef() {
    return this.constructor
  }

  connectedCallback() {
    this.render()
  }

  clear() {
    this.replaceChildren()
  }

  render() {
    if (this.children?.length > 0) this.clear()
    const el = this.parse()
    this.append(el)
    if (this.classRef.renderFn) {
      this.classRef.renderFn.apply(this, [this])
    }
  }

  getElement(selector) {
    return document.querySelector(selector)
  }

  parse(ast = this.classRef.ast) {
    return parse(ast, this)
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
    } else if (typ)
    if (!resolvedDep) throw new Error('Could not resolve dependency')
    try {
      parentEl.append(resolvedDep)
    } catch (err) {
      throw err
    }
  }
}

function parse(ast, vm) {
  if (!ast) throw new Error('Cannot parse invalid ast value')
  const els = []
  const keys = Object.keys(ast)
  for (const tag of keys) {
    let { attrs, children, listeners } = ast[tag]
    if (!attrs) attrs = {}
    if (children && typeof(children) === 'object') {
      const childEls = parse(children, vm)
      children = childEls
    }
    const el = createElement(tag, attrs, children)
    if (listeners && typeof listeners === 'object') {
      for (const event of Object.keys(listeners)) {
        const callback = listeners[event]
        el.addEventListener(event, (e) => {
          return callback.apply(el, [e, vm])
        })
      }
    }
    els.push(el)
  }
  return els.length === 1 ? els[0] : els
}

function createElement(tag, attrs = {}, children = null) {
  const el = document.createElement(tag)
  if (Object.entries(attrs)?.length > 0) {
    for (const attrKey of Object.keys(attrs)) {
      const attrVal = attrs[attrKey]
      el.setAttribute(attrKey, attrVal)
    }
  }
  if (children) {
    if (Array.isArray(children)) {
      el.append(...children)
    } else {
      el.append(children)
    }
  }
  return el
}

module.exports = Base
