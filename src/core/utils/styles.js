
const toKebabCase = (str) => str.replace(/[A-Z]/g, "-$&").toLowerCase()

class StyleSheet extends CSSStyleSheet {
  replaceSync(cssVal) {
    if (typeof cssVal === 'object') {
      cssVal = this.toCSSText(cssVal)
    }
    super.replaceSync(cssVal)
    return this
  }

  toCSSText(styleMap) {
    return Object.entries(styleMap).map(([key, val]) => {
      return (
        `${key} { ${Object.keys(val).map(k => `${toKebabCase(k)}: ${val[k]};`).join(' ')} }`
      )
    }).join('\n')
  }
}

function initStyles(vm, doc) {
  let styles = []
  if (vm._options.styles) {
    styles.push(vm._options.styles)
  }
  if (doc.styleSheets.length > 0) {
    const docStyles = [...doc.styleSheets].map(s => s.ownerNode.innerText)
    styles.push(...docStyles)
  }
  if (styles.length > 0) {
    const constructedStyles = styles.map(cssVal => {
      return new StyleSheet().replaceSync(cssVal)
    })
    vm.shadowRoot.adoptedStyleSheets = constructedStyles
  }
}

module.exports = { initStyles }
