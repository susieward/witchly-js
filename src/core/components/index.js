const BaseComponent = require('./base')

function createComponent(_options, root = null) {
  const options = _preprocess(_options, root)
  const comp = {
    name: options.name,
    _ctor: _createCtor(options, root)
  }
  if (!customElements.get(comp.name)) {
    customElements.define(comp.name, comp._ctor)
  }
  return comp
}

function _preprocess(options, root = null) {
  if (options.hasOwnProperty('default')) {
    options = options.default
  }
  if (options.constructor.name === 'Function') {
    options = (!options.prototype) ? options() : new options()
  }
  if (options.constructor.name === 'Promise') {
    return options.then(r => r).catch(e => console.error(e))
  }
  if (options.components || options.constructor.components) {
    registerComponents(options, root)
  }
  return options
}

async function registerComponents(options, root = null) {
  const comps = options.components || options.constructor?.components
  const values = Object.values(comps)
  try {
    await Promise.all(values.map(comp => registerComponent(comp, root)))
  } catch (err) {
    console.error(err)
  }
}

async function registerComponent(_options, root) {
  const options = await _preprocess(_options, root)
  return createComponent(options, root)
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

module.exports = { createComponent, registerComponent }
