
function createElementJSX(tag, props = {}, ...children) {
  if (props?.children) {
    children = Array.isArray(props.children) ? props.children : [props.children]
  }
  if (tag?.default) {
    tag = tag.default
  }
  if (typeof tag === 'function') {
    return _processTag(tag, props, children)
  }
  const element = document.createElement(tag)
  element._props = props
  for (const [name, value] of Object.entries(props)) {
    if (name.startsWith('on')) {
      element.addEventListener(name.toLowerCase().substr(2), value)
    } else if (name !== 'children') {
      const val = (value?.constructor?.name !== 'String')
        ? JSON.stringify(value)
        : value?.toString() || ''
      element.setAttribute(name, val)
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
  } else if (['Promise', 'AsyncFunction'].includes(child?.constructor?.name)) {
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

export { createElementJSX, createFragmentJSX }
