
const toKebabCase = (str) => str.replace(/[A-Z]/g, "-$&").toLowerCase()
const mapKeys = (obj) => Object.keys(obj).map(k => `${toKebabCase(k)}: ${obj[k]};`)

const toCSSText = (styleMap) => {
  return Object.entries(styleMap).map(([key, val]) => {
    return (`${key} { ${mapKeys(val).join(' ')} }`)
  }).join('\n')
}

class StyleSheet extends CSSStyleSheet {
  replaceSync(cssVal) {
    if (cssVal?.constructor?.name === 'Object') {
      cssVal = toCSSText(cssVal)
    }
    super.replaceSync(cssVal)
    return this
  }
}

function initStyles(vm, doc) {
  let styles = vm._options.styles ? [vm._options.styles] : []
  if (doc.styleSheets.length > 0) {
    const docStyles = [...doc.styleSheets].flatMap(sheet => {
      return [...sheet.cssRules].map(rule => rule.cssText).join('\n')
    })
    styles = [...styles, ...docStyles]
  }
  if (styles.length > 0) {
    const constructedStyles = styles.map(cssVal => {
      return new StyleSheet().replaceSync(cssVal)
    })
    vm.shadowRoot.adoptedStyleSheets = constructedStyles
  }
}

module.exports = { initStyles }
