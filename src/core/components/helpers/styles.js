
const toKebabCase = (str) => str.replace(/[A-Z]/g, "-$&").toLowerCase()
const mapKeys = (obj) => Object.keys(obj).map(k => `${toKebabCase(k)}: ${obj[k]};`)

class StyleSheet extends CSSStyleSheet {
  replaceSync(cssVal) {
    if (cssVal?.constructor?.name === 'Object') {
      cssVal = this.toCSSText(cssVal)
    }
    super.replaceSync(cssVal)
    return this
  }

  toCSSText(styleMap) {
    return Object.entries(styleMap).map(([key, val]) => {
      return (`${key} { ${mapKeys(val).join(' ')} }`)
    }).join('\n')
  }
}

function initStyles(vm, doc) {
  let styles = vm._options.styles ? [vm._options.styles] : []
  if (doc.styleSheets.length > 0) {
    const docStyles = [...doc.styleSheets].map(s => s.ownerNode.innerText)
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
