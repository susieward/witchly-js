const BaseComponent = require('./base')

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

async function _preprocess(options, root) {
  if (options.hasOwnProperty('default')) {
    options = options.default
  }
  if (options.constructor.name === 'Function') {
    options = (!options.prototype) ? options() : new options()
  }
  if (options.constructor.name === 'Promise') {
    return options.then(r => _preprocess(r?.default || r))
  }
  if (options.components || options.constructor.components) {
    await registerComponents(options, root)
  }
  return options
}

async function registerComponents(options, root = null) {
  const comps = options.components || options.constructor?.components
  const values = Object.values(comps)
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

module.exports = { createComponent }
