const BaseComponent = require('./base')
const { _resolve } = require('./helpers/utils')

async function createComponent(_options, root = null) {
  const options = await _preprocess(_options, root)
  const comp = {
    name: options.name,
    _ctor: _createCtor(options, root)
  }
  if (!customElements.get(comp.name)) {
    customElements.define(comp.name, comp._ctor)
  }
  return comp
}

async function _preprocess(_options, root) {
  const options = await _resolve(_options)
  let comps = options.components || options.constructor?.components
  if (comps) {
    await registerComponents(comps, root)
  }
  return options
}

async function registerComponents(components = {}, root = null) {
  const values = Object.values(components)
  if (values.length === 0) return
  const promises = values.map(comp => createComponent(comp, root))
  return Promise.all(promises).catch(err => console.error(err))
}

function _createCtor(options, root = null) {
  return class extends BaseComponent {
    static get observedAttributes() {
      return options.observedAttributes || options.constructor.observedAttributes
    }

    get _options() {
      return options
    }

    get _root() {
      return root
    }
  }
}

module.exports = { createComponent, registerComponents }
