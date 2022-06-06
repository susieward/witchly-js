
function update(prop, newVal, oldVal, vm) {
  if (!vm.shadowRoot?.firstChild) return
  const newDom = vm._domTemplate
  const oldDom = vm.shadowRoot.firstChild
  const exp = buildXPathExpression(newVal)

  let matches = getChangedNodes(exp, newDom, oldDom)

  if (matches.length > 0) {
    processMatches(matches, newVal)
  } else {
    const domChanged = !oldDom.isEqualNode(newDom)
    if (domChanged) {
      oldDom.replaceWith(newDom)
    }
  }
}

function processMatches(matches, newVal) {
  matches = matches.reverse()

  for (const [index, match] of matches.entries()) {
    const { oldEl, newEl } = match

    if (index > 0) {
      const prev = matches[index - 1]
      if (oldEl.contains(prev.newEl)) continue
    }

    const diffAttrs = newEl.getAttributeNames().filter(key => {
      const newValue = newEl.getAttribute(key)
      const oldValue = oldEl.getAttribute(key)
      return (newValue !== oldValue)
    })

    if (diffAttrs.length > 0) {
      for (const attr of diffAttrs) {
        if (attr === 'data-if') {
          oldEl.replaceWith(newEl)
        } else {
          const newValue = newEl.getAttribute(attr)
          oldEl.setAttribute(attr, newValue)
        }
      }
    }

    const newText = newEl.innerText.trim().replaceAll('\n', '')
    const oldText = oldEl.innerText.trim().replaceAll('\n', '')
    const textDiff = newText !== oldText

    if (textDiff && newEl.innerText.includes(newVal)) {
      oldEl.innerText = newEl.innerText
    }
  }
}

function getChangedNodes(exp, newDom, oldDom) {
  const matches = []
  const newDomResults = getXPathResults(exp, newDom)

  let el = newDomResults.iterateNext()

  while (el) {
    const matchExp = `.//*[name()="${el.localName}" and @data-id="${el.getAttribute('data-id')}"]`
    const oldDomResults = getXPathResults(matchExp, oldDom)
    const match = oldDomResults.iterateNext()
    if (match && !match.isEqualNode(el)) {
      matches.push({ newEl: el, oldEl: match })
    }
    el = newDomResults.iterateNext()
  }
  return matches
}

function buildXPathExpression(newVal) {
  const excludedAttrs = ['data-id', 'data-if']
  const excludedAttrNames = excludedAttrs.map(attr => `name()="${attr}"`).join(' or ')
  // retrieve any elements with text that includes the new value
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
