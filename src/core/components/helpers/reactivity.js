
async function update(prop, newVal, oldVal, vm) {
  // TO DO: deep object/array equality checking
  if (typeof newVal === typeof oldVal) {
    if (newVal === oldVal) return
  }

  const newDom = await vm._parse()
  const oldDom = vm.shadowRoot.firstChild

  if (typeof newVal !== 'string') newVal = null
  compareNodes(newDom, oldDom, newVal)
}

function compareNodes(newDom, oldDom, newVal) {
  const exp = _buildXPathExpression(newVal)
  const matches = _getChangedNodes(exp, newDom, oldDom)

  if (matches.length > 0) {
    _processMatches(matches, newVal)
  } else {
    if (!newDom.isEqualNode(oldDom)) {
      oldDom.replaceWith(newDom)
    }
  }
}

function _processMatches(matches, newVal) {
  matches = matches.reverse()

  for (const [index, match] of matches.entries()) {
    const { newEl, oldEl } = match

    if (index > 0) {
      const prev = matches[index - 1]
      if (oldEl.contains(prev.newEl)) continue
    }

    if (newEl.hasAttributes() || oldEl.hasAttributes()) {
      _processAttrs(newEl, oldEl)
    }

    if (newVal !== null) {
      _processInnerText(newEl, oldEl, newVal)
    } else {
      if (newEl.childNodes.length !== oldEl.childNodes.length) {
        oldEl.replaceChildren(...newEl.childNodes)
        break
      }
      compareNodes(newEl, oldEl, newVal)
    }
  }
}

function _processAttrs(newEl, oldEl) {
  const attrs = newEl.getAttributeNames()
  for (const attr of attrs) {
    const newAttrVal = newEl.getAttribute(attr)
    const oldAttrVal = oldEl.getAttribute(attr)
    if (newAttrVal !== oldAttrVal) {
      if (attr === 'data-if') {
        oldEl.replaceWith(newEl)
      } else {
        oldEl.setAttribute(attr, newAttrVal)
      }
    }
  }
}

function _processInnerText(newEl, oldEl, newVal) {
  const newText = newEl.innerText.trim().replaceAll('\n', '')
  const oldText = oldEl.innerText.trim().replaceAll('\n', '')
  const textDiff = newText !== oldText

  if (textDiff && newEl.innerText.includes(newVal)) {
    oldEl.innerText = newEl.innerText
  }
}

function _getChangedNodes(exp, newDom, oldDom) {
  const matches = []
  const newDomResults = _getXPathResults(exp, newDom)

  let el = newDomResults.iterateNext()

  while (el) {
    const matchExp = `.//*[name()="${el.localName}" and @data-id="${el.getAttribute('data-id')}"]`
    const oldDomResults = _getXPathResults(matchExp, oldDom)
    const match = oldDomResults.iterateNext()
    if (match && !match.isEqualNode(el)) {
      matches.push({ newEl: el, oldEl: match })
    }
    el = newDomResults.iterateNext()
  }
  return matches
}

function _buildXPathExpression(newVal) {
  if (newVal == null) return `.//*`

  const excludedAttrs = ['data-id', 'data-if']
  const excludedAttrNames = excludedAttrs.map(attr => `name()="${attr}"`).join(' or ')
  // retrieve any elements with text that includes the new value
  const innerTextExp = `.//*[contains(text(),"${newVal}")]`
  // retrieve any elements with non-excluded attribute values that contain the new value
  const attrValExp = `.//*[@*[contains(., "${newVal}") and not(${excludedAttrNames})]]`
  // retrieve any elements with conditional data attributes to check for changes
  const conditionalExp = `.//*[@data-if]`
  // join results
  return `${innerTextExp} | ${attrValExp} | ${conditionalExp}`
}

function _getXPathResults(exp, referenceNode, args = null) {
  args = args || [null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null]
  return document.evaluate(exp, referenceNode, ...args)
}

module.exports = { update }
