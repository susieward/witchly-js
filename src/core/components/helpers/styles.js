import { _resolve, mapKeys } from './utils'

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

async function initStyles(vm, styleOption, doc) {
  const resolvedStyles = await _resolve(styleOption)
  let styles = resolvedStyles ? [resolvedStyles] : []

  const parentStyles = _resolveParentStyles(vm, doc)

  if (parentStyles.length > 0) {
    styles = [...styles, ...parentStyles]
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
    const docStyles = [...doc.styleSheets].filter(s => Boolean(s?.href) === true)
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
