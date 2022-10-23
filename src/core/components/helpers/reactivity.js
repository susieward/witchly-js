
async function update(prop, newVal, oldVal, vm) {
  // TO DO: deep object/array equality checking
  if (typeof newVal === typeof oldVal) {
    if (newVal === oldVal) return
  }

  const newDom = await vm._parse()
  const oldDom = vm.shadowRoot.firstChild

  console.log(newDom, oldDom)

  if ((typeof newVal !== 'string') || (typeof oldVal !== 'string')) {
    newVal = null
  }

  const exp = _buildXPathExpression(newVal)

  console.log(exp)
  const matches = getChangedNodeMatches(exp, newDom, oldDom)

  console.log(matches, exp)

  if (newVal !== null && matches.length > 0) {
    _processMatches(matches, newVal, newDom, oldDom)
  } else {
    compareNodes(newDom, oldDom, newVal)
  }
}

function _processMatches(matches, newVal, newDom, oldDom) {
  matches = matches.reverse()

  for (const [index, match] of matches.entries()) {
    const { newEl, oldEl } = match
    if (index > 0) {
      const prev = matches[index - 1]
      if (oldEl.contains(prev.newEl)) {
        break
      }
    }
    compareNodes(newEl, oldEl, newVal)
  }
}

function compareNodes(newEl, oldEl, newVal) {
  console.log('newEl, oldEl, isEqualNode: ', newEl, oldEl, newEl.isEqualNode(oldEl))
  if (!newEl.isEqualNode(oldEl)) {

    const newNodeType = newEl.nodeType
    const oldNodeType = oldEl.nodeType

    if (newNodeType === 1 && oldNodeType === 1) {
      if (newEl.hasAttributes() || oldEl.hasAttributes()) {
        processAttrs(newEl, oldEl)
      }
    }

    if (newEl.hasChildNodes() || oldEl.hasChildNodes()) {
      const newChildren = [...newEl.childNodes]
      const oldChildren = [...oldEl.childNodes]

      console.log('newChildren', newChildren)
      console.log('oldChildren', oldChildren)

      if (newChildren.length !== oldChildren.length) {
        if (
          ((newChildren.length === 0) && (oldChildren.length > 0))
          || ((newChildren.length > 0) && (oldChildren.length === 0))
        ) {
          //console.log('replacing', newEl, oldEl)
          return oldEl.replaceWith(newEl)
        }
      }
      _iterChildren(newEl, oldEl, newVal, newChildren, oldChildren)
    }
  }
}

function _iterChildren(newEl, oldEl, newVal, newChildren, oldChildren) {
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
        appendOrInsert(newChild, oldEl)
      } else if ((newNodeType === 3) && (oldNodeType === 3)) {
        if (newChild.nodeValue !== oldChild.nodeValue) {
          oldChild.nodeValue = newChild.nodeValue
          continue
        }
      } else {
        compareNodes(newChild, oldChild, newVal)
      }
    } else if (newChild && !oldChild) {
      console.log('newChild && !oldChild', newChild)
      appendOrInsert(newChild, oldEl)
    } else if (!newChild && oldChild) {
      console.log('!newChild && oldChild', oldChild)
      oldEl.removeChild(oldChild)
    }
  }
}

function appendOrInsert(newChild, parent) {
  const next = newChild.nextSibling
  console.log('newChild, parent, next sibling:', newChild, parent, next)
  if (next?.nodeType === 1) {
    const match = parent.querySelector(`${next.localName}[data-id=${next.dataset.id}]`)
    if (match) {
      return parent.insertBefore(newChild, match)
    }
  }
  parent.append(newChild)
}

function processAttrs(newEl, oldEl) {
  const attrs = newEl.getAttributeNames()
  for (const attr of attrs) {
    const newAttrVal = newEl.getAttribute(attr)
    const oldAttrVal = oldEl.getAttribute(attr)
    if (newAttrVal !== oldAttrVal && attr !== 'data-id') {
      if (attr === 'data-if') {
        oldEl.replaceWith(newEl)
      } else {
        oldEl.setAttribute(attr, newAttrVal)
      }
    }
  }
}

function getChangedNodeMatches(exp, newDom, oldDom) {
  const newDomResults = _getXPathResults(exp, newDom)
  const matches = []
  let node = null

  while (node = newDomResults.iterateNext()) {
    let match = getNodeMatch(node, oldDom)
    if (match && !match.isEqualNode(node)) {
      matches.push({ newEl: node, oldEl: match })
    }
  }
  return matches
}

function getNodeMatch(node, targetDom) {
  let match = null
  if (node?.nodeType === 1) {
    match = targetDom.querySelector(`${node.localName}[data-id=${node.dataset.id}]`)
  } else if (node?.nodeType === 3) {
    const value = node.nodeValue
    const next = node.nextSibling
    const prev = node.previousSibling
    console.log(node, next, prev)
    // console.log(node, value, next, prev)

    // let xpath = `.//text()[contains(.,"${value}")]`
    let xpath = `.//text()`

    if (next) {
      if (next.nodeType === 1) {
        xpath += `[following-sibling::*[1][@data-id="${next.dataset.id}"]]`
      } else if (next.nodeType === 3) {
        xpath += `[following-sibling::text()="${next.nodeValue}"]`
      }
    }

    if (prev) {
      if (prev.nodeType === 1) {
        xpath += ` | .//text()[preceding-sibling::*[1][@data-id="${prev.dataset.id}"]]`
      } else if (prev.nodeType === 3) {
        xpath += ` | .//text()[preceding-sibling::text()="${prev.nodeValue}"]`
      }
    }

    console.log('xpath', xpath)
    const results = _getXPathResults(xpath, targetDom)
    let nodes = []
    let currNode = null

    while (currNode = results.iterateNext()) {
      console.log('currNode', currNode)
      if (currNode.nodeType === 3) {
        if (next?.nodeType === 3 && (currNode.nodeValue === next.nodeValue)) {
          continue
        }
        if (prev?.nodeType === 3 && (currNode.nodeValue === prev.nodeValue)) {
          continue
        }
      }
      nodes.push(currNode)
    }
    console.log('nodes', nodes)

    //document.evaluate(xpath, targetDom, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null)

    // console.log(result)
    // match = result.singleNodeValue
    // console.log('match', match)
  }
  return match
}

function _buildXPathExpression(newVal) {
  if (newVal == null) return `.//*`

  if (newVal.includes(`"`)) {
    newVal = newVal.slice().replaceAll(`"`, `'`)
  }

  const excludedAttrs = ['data-id', 'data-if']
  const excludedAttrNames = excludedAttrs.map(attr => `name()="${attr}"`).join(' or ')

  // retrieve any elements with non-excluded attribute values that contain the new value
  const attrValExp = `.//*[@*[contains(., "${newVal}") and not(${excludedAttrNames})]]`

  // retrieve any elements with text that includes the new value
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
