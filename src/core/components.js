const Base = require('./base')

function createComponent(_options, root = null) {
  const options = _preprocess(_options, root)
  const comp = {
    name: options.name || options.el,
    _ctor: _createCtor(options, root)
  }
  if (!customElements.get(comp.name)) {
    customElements.define(comp.name, comp._ctor)
  }
  return comp
}

function _preprocess(_options, root = null) {
  let options = _options

  if (options.hasOwnProperty('default')) {
    options = options.default
  }

  if (options.constructor.name === 'Function') {
    options = (!options.prototype) ? options() : new options()
  }
  if (options.constructor.name === 'Promise') {
    return options.then(r => r)
  }
  if (options.components || options.constructor.components) {
    registerComponents(options, root)
  }
  return options
}

async function registerComponents(options, root = null) {
  const comps = options.components || options.constructor?.components
  const values = Object.values(comps)
  await Promise.all(values.map(comp => registerComponent(comp, root)))
}

async function registerComponent(_options, root) {
  const options = await Promise.resolve(_preprocess(_options, root))
  return createComponent(options, root)
}

function _createCtor(options, root = null) {
  return class extends Base {
    static get observedAttributes() {
      return options.observedAttributes || options.constructor.observedAttributes
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

    disconnectedCallback() {
      if (this._options.disconnectedCallback) {
        this._options.disconnectedCallback.call(this)
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

module.exports = { createComponent, registerComponent }
