
async function update(prop, newVal, oldVal, vm) {
  const normalizedNewVal = _normalize(newVal)
  const normalizedOldVal = _normalize(oldVal)
  if (normalizedNewVal === normalizedOldVal) return
  // TO DO: address issue of dom changes in connectedCallback not being reflected
  const oldDom = vm.shadowRoot.firstElementChild
  const newDom = await vm._parse()

  if (!['string', 'number'].includes(typeof newVal) || !['string', 'number'].includes(typeof oldVal)) {
    newVal = null
  }

  const exp = _buildXPathExpression(newVal)
  const matches = getChangedNodeMatches(exp, newDom, oldDom)

  if (newVal !== null && matches.length > 0) {
    processMatches(matches, newVal, newDom, oldDom)
  } else if (!newDom.isEqualNode(oldDom)) {
    compareNodes(newDom, oldDom, newVal, newDom, oldDom)
  }
}

function processMatches(matches, newVal, newDom, oldDom) {
  for (const [index, match] of matches.entries()) {
    const { newEl, oldEl } = match
    if (index > 0) {
      const prev = matches[index - 1]
      if (prev.newEl.contains(newEl) || prev.oldEl?.contains(newEl)) {
        continue
      }
    }
    compareNodes(newEl, oldEl, newVal, newDom, oldDom)
  }
}

function compareNodes(newNode, oldNode, newVal, newDom, oldDom) {
  if (newNode && !oldNode) {
    let newParent = newNode.parentElement
    let oldParent = getNodeMatch(newParent, oldDom)
    if (!oldParent) return
    return appendOrInsert(newNode, oldParent)
  }

  if (newNode.isEqualNode(oldNode)) return

  if (_shouldCompareNodes(newNode, oldNode)) {
      if (newNode.nodeType === 1 && oldNode.nodeType === 1) {
        if (newNode.hasAttributes() || oldNode.hasAttributes()) {
          processAttrs(newNode, oldNode)
        }
      }
      if (newNode.hasChildNodes() || oldNode.hasChildNodes()) {
        if (newNode.localName !== 'map-items') {
          iterChildren(newNode, oldNode, newVal, newDom, oldDom)
        }
      }
  } else {
    if (newNode.nodeType === 1 && oldNode.nodeType === 1) {
      let newParent = newNode.parentElement
      let oldParent = getNodeMatch(newParent, oldDom)
      if (oldParent) {
        oldNode.replaceWith(newNode)
      }
    }
  }
}

function processAttrs(newEl, oldEl) {
  const attrs = newEl.getAttributeNames()

  for (const attr of attrs) {
    let newVal = _normalize(newEl.getAttribute(attr))
    let oldVal = _normalize(oldEl.getAttribute(attr))
    if (newVal !== oldVal && (attr !== 'data-id')) {
      if (attr === 'data-if') {
        oldEl.replaceWith(newEl)
      } else {
        oldEl.setAttribute(attr, newEl.getAttribute(attr))
      }
    }
  }
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

function _shouldReplaceEl(newEl, oldEl, newChildren, oldChildren) {
  if (newChildren.length !== oldChildren.length) {
    if (
      ((newChildren.length === 0) && (oldChildren.length > 0))
      || ((newChildren.length > 0) && (oldChildren.length === 0))
    ) {
      return true
    }
    const newTags = newChildren.map(c => c?.nodeName?.toLowerCase())
    const oldTags = oldChildren.map(c => c?.nodeName?.toLowerCase())
      if (newTags.every(t => !oldTags.includes(t))) {
        return true
      }
    }
    return false
}

function iterChildren(newEl, oldEl, newVal, newDom, oldDom) {
  let newChildren = [...newEl.childNodes]
  let oldChildren = [...oldEl.childNodes]

  if (_shouldReplaceEl(newEl, oldEl, newChildren, oldChildren)) {
    return oldEl.replaceWith(newEl)
  }
  let index = 0

  while (true) {
    let newChild = newChildren[index]
    let oldChild = oldChildren[index]

    if (!newChild && !oldChild) break
    index += 1

    if (newChild && oldChild) {
      const newNodeType = newChild.nodeType
      const oldNodeType = oldChild.nodeType

      if (newNodeType !== oldNodeType) {
        const newNodeMatch = getNodeMatch(newChild, oldEl)
        const oldNodeMatch = getNodeMatch(oldChild, newEl)
        if (newNodeMatch) {
          if (!oldNodeMatch) {
            oldEl.removeChild(oldChild)
            oldChildren = [...oldEl.childNodes]
          }
          continue
        }
        appendOrInsert(newChild, oldEl)
        oldChildren = [...oldEl.childNodes]
      } else if ((newNodeType === 3) && (oldNodeType === 3)) {
        if (newChild.nodeValue !== oldChild.nodeValue) {
          oldChild.nodeValue = newChild.nodeValue
          continue
        }
      } else {
        compareNodes(newChild, oldChild, newVal, newDom, oldDom)
      }
    } else if (newChild && !oldChild) {
      appendOrInsert(newChild, oldEl)
      oldChildren = [...oldEl.childNodes]
    } else if (!newChild && oldChild) {
      oldEl.removeChild(oldChild)
      oldChildren = [...oldEl.childNodes]
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
  parent.append(newChild)
}

function getChangedNodeMatches(exp, newDom, oldDom) {
  const newDomResults = _getXPathResults(exp, newDom)
  const matches = []
  let node = null

  while (node = newDomResults.iterateNext()) {
    let match = getNodeMatch(node, oldDom)
    if (!match || !match.isEqualNode(node)) {
      matches.push({ newEl: node, oldEl: match })
    }
  }
  return matches
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
    const next = node.nextSibling
    const prev = node.previousSibling

    let xpath = `.//text()[contains(.,'${value}')]`
    // let xpath = `.//text()='${node.nodeValue}' | ./text()='${node.nodeValue}'`
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
      const sameNodeVals = matches.filter(m => areTextNodesEqual(m, node))
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

function _buildXPathExpression(newVal) {
  if (newVal == null) return `.//*`

  if (typeof newVal === 'string' && newVal.includes(`"`)) {
    newVal = newVal.slice().replaceAll(`"`, `'`)
  }

  const excludedAttrs = ['data-id', 'data-if']
  const excludedAttrNames = excludedAttrs.map(attr => `name()="${attr}"`).join(' or ')

  // retrieve any elements with non-excluded attribute values that contain the new value
  const attrValExp = `.//*[@*[contains(., "${newVal}") and not(${excludedAttrNames})]]`

  // retrieve any text nodes or elements with text nodes that include the new value
  const innerTextExp = [
    `./*[text()[contains(.,"${newVal}")]]`,
    `.//*[text()[contains(.,"${newVal}")]]`,
    `.//text()[contains(.,"${newVal}")]`
  ]
  // retrieve any elements with conditional data attributes to check for changes
  const conditionalExp = `.//*[@data-if]`

  // join results
  return [...innerTextExp, attrValExp, conditionalExp].join(' | ')
}

function _getXPathResults(exp, referenceNode, args = null) {
  args = args || [null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null]
  return document.evaluate(exp, referenceNode, ...args)
}

module.exports = { update }
