class Base extends HTMLElement {
  static ast = null

  static init(ast) {
    this.ast = ast
    return this
  }

  get classRef() {
    return Base
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
  }

  getElement(selector) {
    return document.querySelector(selector)
  }

  parse(ast = this.classRef.ast) {
    return parse(ast, this)
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
