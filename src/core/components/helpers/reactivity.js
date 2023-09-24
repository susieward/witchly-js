
async function update(prop, newVal, oldVal, vm) {
  const normalizedNewVal = _normalize(newVal)
  const normalizedOldVal = _normalize(oldVal)
  if (normalizedNewVal === normalizedOldVal) return
  // TO DO: address issue of dom changes in connectedCallback not being reflected
  const oldDom = vm.shadowRoot.firstChild
  const newDom = await vm._parse()
  newVal = null

  if (!newDom.isEqualNode(oldDom)) {
    compareNodes(newDom, oldDom)
  }
}

function compareNodes(newNode, oldNode) {
  if (newNode.isEqualNode(oldNode)) return

  if (_shouldCompareNodes(newNode, oldNode)) {
      if (newNode.nodeType === 1 && oldNode.nodeType === 1) {
        if (newNode.hasAttributes() || oldNode.hasAttributes()) {
          processAttrs(newNode, oldNode)
        }
      }
      if (newNode.hasChildNodes() || oldNode.hasChildNodes()) {
        if (newNode.localName !== 'map-items') {
          iterChildren(newNode, oldNode)
        }
      }
  }
}

function iterChildren(newEl, oldEl) {
  let newChildren = [...newEl.childNodes]
  let oldChildren = [...oldEl.childNodes]

  const addedChildren = []
  const removedChildren = []

  if (newChildren.length > oldChildren.length && (oldChildren.length > 0)) {
    const netNewChildren = newChildren.filter(child => {
      const match = getNodeMatch(child, oldEl)
      return !match
    })
    if (netNewChildren.length > 0) {
      addedChildren.push(...netNewChildren)
      newChildren = newChildren.filter(child => Boolean(getNodeMatch(child, oldEl)))
    }
  } else if (newChildren.length < oldChildren.length) {
    const subtractedChildren = oldChildren.filter(child => {
      const match = getNodeMatch(child, newEl)
      return !match
    })
    if (subtractedChildren.length > 0) {
      removedChildren.push(...subtractedChildren)
      oldChildren = oldChildren.filter(child => Boolean(getNodeMatch(child, newEl)))
    }
  }

  let index = 0

  while (true) {
    let newChild = newChildren[index]
    let oldChild = oldChildren[index]

    if (!newChild && !oldChild) break
    index += 1

    if (newChild && oldChild) {
      if (newChild.isEqualNode(oldChild)) {
        continue
      }
      const newNodeType = newChild.nodeType
      const oldNodeType = oldChild.nodeType

      if (newNodeType !== oldNodeType) {
        const newNodeMatch = getNodeMatch(newChild, oldEl)
        const oldNodeMatch = getNodeMatch(oldChild, newEl)
        if (newNodeMatch) {
          if (!oldNodeMatch) {
            removedChildren.push(oldChild)
          }
          continue
        }
        addedChildren.push(newChild)
      } else if ((newNodeType === 3) && (oldNodeType === 3)) {
        if (newChild.nodeValue !== oldChild.nodeValue) {
          oldChild.nodeValue = newChild.nodeValue
          continue
        }
      } else {
        const shouldCompare = _shouldCompareNodes(newChild, oldChild)
        if (shouldCompare) {
          compareNodes(newChild, oldChild)
        }
      }
    } else if (newChild && !oldChild) {
      addedChildren.push(newChild)
    } else if (!newChild && oldChild) {
      removedChildren.push(oldChild)
    }
  }

  if (addedChildren.length > 0) {
    for (const child of addedChildren) {
      appendOrInsert(child, oldEl)
    }
  }

  if (removedChildren.length > 0) {
    for (const child of removedChildren) {
      oldEl.removeChild(child)
    }
  }
}

function appendOrInsert(newChild, parent) {
  const next = newChild.nextSibling
  const prev = newChild.previousSibling

  const nextMatch = next ? getNodeMatch(next, parent) : null
  const prevMatch = prev ? getNodeMatch(prev, parent) : null

  if (next && nextMatch) {
    if (prevMatch?.nextSibling?.nodeType === 3 && (newChild.nodeType === 3)) {
      // update the value in place if "oldChild" text node already exists
      if (!prevMatch.nextSibling.isEqualNode(nextMatch)) {
        return prevMatch.nextSibling.nodeValue = newChild.nodeValue
      }
    }
    return parent.insertBefore(newChild, nextMatch)
  }
  if (prev && prevMatch) {
    if (prevMatch?.nextSibling?.nodeType === 3 && (newChild.nodeType === 3)) {
      return prevMatch.nextSibling.nodeValue = newChild.nodeValue
    }
  }
  if (next && !prev) {
    parent.prepend(newChild)
  } else {
    parent.append(newChild)
  }
}

function processAttrs(newEl, oldEl) {
  let attrs = newEl.getAttributeNames()
  attrs = attrs.filter(attr => attr !== 'data-id')

  for (const attr of attrs) {
    let newVal = _normalize(newEl.getAttribute(attr))
    let oldVal = _normalize(oldEl.getAttribute(attr))

    if (newVal !== oldVal) {
      oldEl.setAttribute(attr, newEl.getAttribute(attr))
    }
  }
  for (const attr of oldEl.getAttributeNames()) {
    if (!newEl.hasAttribute(attr)) {
      oldEl.removeAttribute(attr)
    }
  }
  return false
}

function _normalize(val) {
  if (val && typeof val === 'object') val = JSON.stringify(val)
  return val
}

function _shouldCompareNodes(newNode, oldNode) {
  const newNodeType = newNode.nodeType
  const oldNodeType = oldNode.nodeType

  if (newNodeType !== oldNodeType) return false

  if (newNodeType === 1 && oldNodeType === 1) {
    return (newNode.localName === oldNode.localName)
      && (newNode.dataset.id === oldNode.dataset.id)
  }
  return true
}

function getNodeMatch(node, targetDom) {
  let match = null
  if (node?.nodeType === 1) {
    match = targetDom.querySelector(`${node.localName}[data-id=${node.dataset.id}]`)
    if (!match && (targetDom.dataset.id === node.dataset.id)) {
      match = targetDom
    }
  } else if (node?.nodeType === 3) {
    const value = node.nodeValue

    let xpath = `.//text()[contains(.,'${value}')]`
    const results = _getXPathResults(xpath, targetDom)
    let nodes = []
    let matches = []
    let currNode = null

    while (currNode = results.iterateNext()) {
      nodes.push(currNode)
      if (currNode.isEqualNode(node)) {
        matches.push(currNode)
      }
    }
    if (nodes.length > 0 && matches.length > 0) {
      const sameNodeVal = matches.find(m => areTextNodesEqual(m, node))
      if (sameNodeVal) match = sameNodeVal
    }
  }
  return match
}

function areTextNodesEqual(node1, node2) {
  if (node1 && node2) {
    const val1 = node1.nodeValue
    const val2 = node2.nodeValue
    return (val1 === val2)
      && (node1.length === node2.length)
      && (node1.parentElement.dataset.id === node2.parentElement.dataset.id)
  }
  return false
}

function _getXPathResults(exp, referenceNode, args = null) {
  args = args || [null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null]
  return document.evaluate(exp, referenceNode, ...args)
}

export { update }
