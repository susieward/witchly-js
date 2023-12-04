
class AttrHandler extends HTMLElement {
  get staticAttrs() {
    return ['data-id', 'data-root']
  }

  getAttribute(attr) {
    const val = super.getAttribute(attr)
    return this._parseValue(val)
  }

  setAttribute(attr, newVal) {
    if (this.staticAttrs.includes(attr) && this.hasAttribute(attr)) {
      throw new Error(`Cannot redefine static attribute: ${attr}`)
    }
    const val = (newVal?.constructor?.name !== 'String')
      ? JSON.stringify(newVal)
      : newVal?.toString() || ''
    return super.setAttribute(attr, val)
  }

  removeAttribute(attr) {
    if (this.staticAttrs.includes(attr)) {
      throw new Error(`Cannot remove static attribute: ${attr}`)
    }
    return super.removeAttribute(attr)
  }

  _parseValue(value) {
    try {
      const parsed = JSON.parse(value)
      value = parsed
    } catch {
      // no-op
    }
    return value
  }
}

export default AttrHandler
