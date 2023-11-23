import { createElementJSX, createFragmentJSX } from './jsx'
import { _isElement } from '../components/helpers/utils'

async function parse(val, vm) {
  if (!val) {
    throw new Error(`Cannot parse invalid template value: ${JSON.stringify(val)}`)
  }
  let result = ''
  try {
    if (val.constructor.name === 'Promise') {
      result = await val.then(result => parse(result, vm))
    } else if (typeof val === 'object') {
      if (Array.isArray(val)) {
        result = processElements(val, vm)
      } else {
        result = _isElement(val) ? processElements([val], vm) : parseAST(val, vm)
      }
    } else if (typeof val === 'string') {
      result = parseTemplateString(val, vm)
    }
    return result
  } catch (err) {
    console.error(err)
  }
}

function processElements(domEls, vm, parentId = null) {
  const els = []
  const nodeNames = {}

  for (const el of domEls) {
    if (el?.nodeType === 1) {
      const name = el.nodeName.toLowerCase()
      if (!nodeNames[name]) {
        nodeNames[name] = 0
      }
      nodeNames[name] += 1
      if (el.hasAttribute('data-if')) {
        let value = el.dataset.if
        const result = _parseConditionalExp(value)
        el.dataset.if = result
        if (!result) {
          let style = 'display: none;'
          if (el.hasAttribute('style')) {
            style = `${el.getAttribute('style')}; ${style}`
          }
          el.setAttribute('style', style)
        }
      }
      const nameCount = nodeNames[name]
      let id = `${el.localName}-${nameCount}`
      if (parentId) id = `${id}-${parentId}`
      el.setAttribute('data-id', id)
  
      if (el.childNodes?.length > 0) {
        let children = processElements(el.childNodes, vm, id)
        if (!Array.isArray(children)) children = [children]
        el.replaceChildren(...children)
      }
    }
    els.push(el)
  }
  return els.length === 1 ? els[0] : els
}

function _parseConditionalExp(value) {
  if (['undefined', 'null', 'false'].includes(value)) {
    value = false
  }
  return Boolean(value)
}

function parseTemplateString(template, vm) {
  const temp = document.createElement('template')
  temp.innerHTML = template
  const domChildren = temp.content.cloneNode(true)
  const output = processElements(domChildren.children, vm)
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

export { parse, createElementJSX, createFragmentJSX }
