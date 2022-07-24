
function createElementJSX(tag, props = {}, ...children) {
  if (props?.children) {
    children = Array.isArray(props.children) ? props.children : [props.children]
  }
  if (typeof tag === 'object' && tag?.default) {
    tag = tag.default
  }
  if (typeof tag === 'function') {
    return _processTag(tag, props, children)
  }
  const element = document.createElement(tag)
  for (const [name, value] of Object.entries(props)) {
    if (name.startsWith('on')) {
      element.addEventListener(name.toLowerCase().substr(2), value)
    } else if (name !== 'children') {
      element.setAttribute(name, value?.toString() || '')
    }
  }
  if (children.length > 0) {
    _appendChild(element, children).catch(e => console.error(e))
  }
  return element
}

async function _appendChild(parent, child) {
  if (!child) {
    return
  } else if (Array.isArray(child)) {
    await Promise.all(child.map(c => _appendChild(parent, c)))
  } else if (child.constructor.name === 'Promise') {
    await child.then(c => _appendChild(parent, c))
  } else {
    parent.appendChild(child.nodeType ? child : document.createTextNode(child))
  }
}

function _processTag(tag, props, children) {
  const result = !tag.prototype ? tag(props, children) : new tag(props, children)
  if (result.constructor.name === 'Promise') {
    return _processTagAsync(result, props, children)
  }
  return result?.render?.call(result) || result
}

async function _processTagAsync(tag, props, children) {
  tag = await tag.then(r => r?.default || r)
  return _processTag(tag, props, children)
}

function createFragmentJSX(props, ...children) {
  if (props?.children) {
    children = Array.isArray(props.children) ? props.children : [props.children]
  }
  return children
}

async function parse(val, vm) {
  if (!val) {
    throw new Error(`Cannot parse invalid value: ${JSON.stringify(val)}`)
  }
  let result = ''
  if (val.constructor.name === 'Promise') {
    result = await val.then(result => parse(result, vm))
  } else if (typeof val === 'object') {
    result = _isElement(val) ? parseElements([val], vm) : parseAST(val, vm)
  } else if (typeof val === 'string') {
    result = parseTemplateString(val, vm)
  }
  return result
}

function _isElement(val) {
  return val.childNodes?.constructor?.name === 'NodeList'
}

function parseElements(domEls, vm, parentId = null) {
  let count = 0
  const els = []

  for (const el of domEls) {
    let id = `${el.localName}-${count}`
    if (parentId) id = `${el.localName}-${count}-${parentId}`
    el.setAttribute('data-id', id)

    if (el.hasAttribute('data-if')) {
      _parseConditionalExp(el)
    }

    if (el.children?.length > 0) {
      const children = parseElements(el.children, vm, id)
      el.children = children
    }

    const listeners = el.getAttributeNames().filter(a => {
      return a.toLowerCase().includes('on') || a.startsWith(':')
    })
    if (listeners.length > 0) {
      _parseEventListeners(el, listeners, vm)
    }

    els.push(el)
    count++
  }
  return els.length === 1 ? els[0] : els
}

function _parseConditionalExp(el) {
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
}

function _parseEventListeners(el, attrs, vm) {
  for (const attr of attrs) {
    if (attr?.startsWith(':')) {
      const val = el.getAttribute(attr)
      if (vm[val] !== undefined) {
        el.addEventListener('input', function(e) {
          return vm[val] = e.detail || e.target.value
        })
      }
    } else {
      _parseEvent(attr, el, vm)
    }
  }
}

function _parseEvent(attr, el, vm) {
  const val = el.getAttribute(attr)
  const evt = attr.substring(2)
  let evtArgs = ''
  let fn = val.slice()

  if (fn.includes(`(`)) {
    fn = fn.substring(0, fn.indexOf(`(`))
    evtArgs = val.substring(val.indexOf(`(`) + 1, val.indexOf(`)`)).replaceAll(`'`, ``)
    evtArgs = evtArgs.split(',')
  }

  let callback = vm[fn]
  if (callback) {
    if (evtArgs.length > 0) {
      el.addEventListener(evt, function() {
        return callback.apply(vm, [...evtArgs])
      })
    } else {
      el.addEventListener(evt, function(...args) {
        return callback.call(vm, ...args)
      })
    }
    el.removeAttribute(attr)
  }
}

function parseTemplateString(template, vm) {
  const temp = document.createElement('template')
  temp.innerHTML = template
  const domChildren = temp.content.cloneNode(true)
  const output = parseElements(domChildren.children, vm)
  return output
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
    const el = _createElement(tag, attrs, children)
    if (el.hasAttribute('data-if')) {
      _parseConditionalExp(el)
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

function _createElement(tag, attrs = {}, children = null) {
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

module.exports = { parse, createElementJSX, createFragmentJSX }
