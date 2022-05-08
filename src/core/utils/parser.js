
function parse(val, vm) {
  if (!val) {
    throw new Error(`Cannot parse invalid value: ${JSON.stringify(val)}`)
  }
  let result = null
  if (typeof val === 'object') {
    result = parseAST(val, vm)
  } else if (typeof val === 'string') {
    result = parseTemplate(val, vm)
  }
  return result
}

function parseTemplate(template, vm) {
  const parser = new DOMParser()
  const dom = parser.parseFromString(template, 'text/html')
  const domChildren = dom.body.children
  const output = parseElements(domChildren, vm)
  return output
}

function parseElements(domEls, vm, parentId = null) {
  let count = 0
  const els = []
  for (const el of domEls) {
    let id = `${el.localName}-${count}`
    if (parentId) {
      id = `${el.localName}-${count}-${parentId}`
    }
    el.setAttribute('data-id', id)
    if (el.hasAttribute('data-if')) {
      parseConditionalExp(el)
    }
    if (el.hasChildNodes()) {
      const children = parseElements(el.children, vm, id)
      el.children = children
    }
    const attrNames = el.getAttributeNames()
    const eventAttrs = attrNames.filter(name => {
      return name?.toLowerCase()?.includes('on')
    })
    if (eventAttrs.length > 0) {
      //console.log(eventAttrs)
      for (const attr of eventAttrs) {
        const fn = el.getAttribute(attr)
        const evt = attr.substring(2)
        if (Object.keys(vm).includes(fn)) {
          const callback = vm[fn]
          el.addEventListener(evt, {
            handleEvent: function(e) {
              return callback.apply(vm, [e, vm])
            }
          }, false)
          el.removeAttribute(attr)
        }
      }
    }
    els.push(el)
    count++
  }
  return els.length === 1 ? els[0] : els
}

function parseConditionalExp(el) {
  let value = el.dataset.if
  if (['undefined', 'null', 'false'].includes(value)) {
    value = false
  }
  if (value === false) {
    let style = 'display: none;'
    if (el.hasAttribute('style')) {
      style = `${el.getAttribute('style')}; ${style}`
    }
    el.setAttribute('style', style)
  }
  return el
}

function parseAST(ast, vm) {
  const els = []
  const keys = Object.keys(ast)
  for (const tag of keys) {
    let { attrs, children, listeners } = ast[tag]
    if (!attrs) attrs = {}
    if (children && Array.isArray(children)) {
      const childEls = children.map(child => parseAST(child, vm))
      children = childEls
    }
    const el = createElement(tag, attrs, children)
    if (el.hasAttribute('data-if')) {
      parseConditionalExp(el)
    }
    if (listeners && typeof listeners === 'object') {
      for (const event of Object.keys(listeners)) {
        const callback = listeners[event]
        el.addEventListener(event, (e) => {
          return callback.apply(vm, [e, vm])
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

function buildAST(el) {
  if (el.nodeType === 3) {
    return el.data
  }
  const tag = el.localName
  let attrs = null
  let children = null

  if (el.hasChildNodes) {
    children = [...el.childNodes].map(child => buildAST(child))
    if (children.length === 1 && typeof children[0] === 'string') {
      children = children[0]
    }
  }
  const attrNames = el.getAttributeNames()
  if (attrNames?.length > 0) {
    attrs = {}
    for (const attr of attrNames) {
      attrs[attr] = el.getAttribute(attr)
    }
  }
  const nodeObj = {}
  if (attrs) nodeObj['attrs'] = attrs
  if (children) nodeObj['children'] = children

  const ast = {
    [tag]: nodeObj
  }
  return ast
}

module.exports = {
  parse,
  buildAST
}
