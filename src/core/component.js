const Base = require('./base')
const { initOptions } = require('./utils/options')

class ComponentFactory {
  static create(_options, root = null) {
    const options = this._preprocess(_options, root)
    const comp = {
      name: options.name || options.constructor.name,
      _ctor: _createCtor(options, root)
    }
    if (!customElements.get(comp.name)) {
      customElements.define(comp.name, comp._ctor)
    }
    return comp
  }

  static _preprocess(_options, root = null) {
    let options = _options

    if (options.hasOwnProperty('default')) {
      options = options.default
    }
    if (options.constructor.name === 'Function') {
      options = (!options.prototype) ? options() : new options()
    }
    if (options.constructor.name === 'Promise') {
      return options.then(r => this._preprocess(r, root))
    }
    if (options.components || options.constructor.components) {
      this.registerComponents(options, root)
    }
    return options
  }

  static async registerComponents(options, root = null) {
    const comps = options.components || options.constructor.components
    const values = Object.values(comps)
    await Promise.all(values.map(comp => {
      return this.registerComponent(comp, root)
    }))
  }

  static async registerComponent(_options, root) {
    const options = await Promise.resolve(this._preprocess(_options, root))
    return this.create(options, root)
  }
}

function _createCtor(options, root = null) {
  return class extends Base {

    static get observedAttributes() {
      return options.constructor.observedAttributes
    }

    constructor() {
      super()
      initOptions(this._options, this, this._update)
      if (this._options.createdCallback) {
        this._options.createdCallback.call(this)
      }
      this.attachShadow({ mode: 'open' })
      _initStyles(this)
    }

    get _options() {
      return options
    }

    get _root() {
      return root
    }

    connectedCallback() {
      super.connectedCallback()
      if (this._options.connectedCallback) {
        this._options.connectedCallback.call(this)
      }
    }

    attributeChangedCallback(...args) {
      super.attributeChangedCallback(...args)
      if (this._options.attributeChangedCallback) {
        this._options.attributeChangedCallback.call(this, ...args)
      }
    }
  }
}

function _initStyles(vm) {
  let styles = []
  if (vm._options.styles) {
    styles.push(vm._options.styles)
  }
  if (document.styleSheets.length > 0) {
    const docStyles = [...document.styleSheets].map(s => s.ownerNode.innerText)
    styles.push(...docStyles)
  }
  if (styles.length > 0) {
    const constructedStyles = styles.map(cssText => {
      const styleSheet = new CSSStyleSheet()
      styleSheet.replaceSync(cssText)
      return styleSheet
    })
    vm.shadowRoot.adoptedStyleSheets = constructedStyles
  }
}

module.exports = ComponentFactory
