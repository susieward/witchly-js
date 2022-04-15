
export class Base extends HTMLElement {
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
    const els = parse(this.classRef.ast)
    this.append(...els)
  }

  getElement(selector) {
    return document.querySelector(selector)
  }
}

function parse(ast) {
  if (!ast) throw new Error('Cannot parse invalid ast value')
  const els = []
  const keys = Object.keys(ast)
  for (const tag of keys) {
    let { attrs, children } = ast[tag]
    if (!attrs) attrs = {}
    if (children && typeof(children) === 'object') {
      const childEls = parse(children)
      children = childEls
    }
    const el = createElement(tag, attrs, children)
    els.push(el)
  }
  return els
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
