
function createElement(tag, props, ...children) {
  if (typeof tag === "function") return tag(props, ...children);
  const element = document.createElement(tag);

  Object.entries(props || {}).forEach(([name, value]) => {
    if (name.startsWith("on") && name.toLowerCase() in window)
      element.addEventListener(name.toLowerCase().substr(2), value);
    else element.setAttribute(name, value.toString());
  });

  children.forEach(child => {
    appendChild(element, child);
  });

  return element;
}

function appendChild(parent, child) {
  if (Array.isArray(child))
    child.forEach(nestedChild => appendChild(parent, nestedChild));
  else
    parent.appendChild(child.nodeType ? child : document.createTextNode(child));
};

function createFragment(props, ...children) {
  return children;
}


function parse(val, vm) {
  if (!val) {
    throw new Error(`Cannot parse invalid value: ${JSON.stringify(val)}`)
  }
  let result = null
  if (typeof val === 'object') {
    if (val.constructor.name.toLowerCase()?.includes('element')) {
      return parseElements([val], vm)
    }
    result = parseAST(val, vm)
  } else if (typeof val === 'string') {
    result = parseTemplateString(val, vm)
  }
  return result
}

function parseTemplateString(template, vm) {
  const temp = document.createElement('template')
  temp.innerHTML = template
  const domChildren = temp.content.cloneNode(true)
  const output = parseElements(domChildren.children, vm)
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
      _parseConditionalExp(el)
    }
    if (el.hasChildNodes()) {
      const children = parseElements(el.children, vm, id)
      el.children = children
    }

    const attrs = el.getAttributeNames()
    for (const attr of attrs) {
      if (attr?.toLowerCase()?.includes('on')) {
        _parseEvent(attr, el, vm)
      } else if (attr?.startsWith(':')) {
        const val = el.getAttribute(attr)
        if (vm[val] !== undefined) {
          el.addEventListener('input', function(e) {
            return vm[val] = e.detail || e.target.value
          })
        }
      }
    }

    els.push(el)
    count++
  }
  return els.length === 1 ? els[0] : els
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

module.exports = { parse, createElement, createFragment }
