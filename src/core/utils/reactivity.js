
function update(prop, newVal, oldVal, vm) {
  const newDom = vm._domTemplate
  const currDom = vm.shadowRoot.firstChild
  let matches = getChangedNodes(newVal, newDom, currDom)

  if (matches.length > 0) {
    matches = matches.reverse()
    for (const [index, obj] of matches.entries()) {
      const { oldEl, newEl } = obj
      if (index > 0) {
        const prev = matches[index - 1]
        if (oldEl.contains(prev.newEl)) continue
      }
      oldEl.replaceWith(newEl)
    }
  } else {
    const domChanged = !currDom.isEqualNode(newDom)
    if (domChanged) {
      currDom.replaceWith(newDom)
    }
  }
}

function getChangedNodes(newVal, newDom, currDom) {
  const exp = buildXPathExpression(newVal)
  const newDomResults = getXPathResults(exp, newDom)

  let el = newDomResults.iterateNext()
  const matches = []

  while (el) {
    const matchExp = `.//*[name()="${el.localName}" and @data-id="${el.dataset.id}"]`
    const currDomResults = getXPathResults(matchExp, currDom)
    const match = currDomResults.iterateNext()
    if (match && !match.isEqualNode(el)) {
      matches.push({ newEl: el, oldEl: match })
    }
    el = newDomResults.iterateNext()
  }
  return matches
}

function buildXPathExpression(newVal) {
  const excludedAttrs = ['value', 'id', 'data-id']
  const excludedAttrNames = excludedAttrs.map(attr => `name()="${attr}"`).join(' or ')
  // retrieve any elements with text that matches the new value
  const innerTextExp = `.//*[contains(text(),"${newVal}")]`
  // retrieve any elements with non-excluded attribute values that contain the new value
  const attrValExp = `.//*[@*[contains(., "${newVal}") and not(${excludedAttrNames})]]`
  // retrieve any elements with conditional data attributes to check for changes
  const conditionalExp = `.//*[@data-if]`
  // join results
  const exp = `${innerTextExp} | ${attrValExp} | ${conditionalExp}`
  return exp
}

function getXPathResults(exp, referenceNode, args = null) {
  args = args || [null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null]
  return document.evaluate(exp, referenceNode, ...args)
}

module.exports = { update }
