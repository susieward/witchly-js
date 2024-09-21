import { toKebabCase } from './utils'

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
  let styles = [vm.styles].filter(r => Boolean(r))
  const parentStyles = _resolveParentStyles(vm, doc)

  if (parentStyles.length > 0) {
    styles = [...parentStyles, ...styles]
  }
  if (styles.length > 0) {
    styles = styles.map(val => {
      if (val?.constructor?.name !== 'StyleSheet') {
        return new StyleSheet().replaceSync(val)
      }
      return val
    })
  }
  return styles
}

function _resolveParentStyles(vm, doc) {
  let styleSheets = []
  if (vm._isRoot) {
    const docStyles = [...doc.styleSheets]
    styleSheets = [...docStyles].flatMap(sheet => {
      return [...sheet.cssRules].map(rule => rule.cssText).join('\n')
    })
  } else {
    const parentStyles = vm.$root.constructor.styleSheets || []
    styleSheets = [...parentStyles]
  }
  return styleSheets
}

export { initStyles }
