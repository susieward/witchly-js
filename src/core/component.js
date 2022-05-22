const Base = require('./base')
const { initOptions, preprocess } = require('./utils/options')

function createComponent(_options, root = null) {
  const options = preprocess(_options)
  if (options.hasOwnProperty('components')) {
    registerComponents(options, root)
  }
  const comp = {
    name: options.name,
    ctor: createClass(options, root)
  }
  register(comp)
  return comp
}

async function registerComponents(options, root = null) {
  const values = Object.values(options.components)
  const comps = await Promise.all(values.map(comp => {
    return registerComponent(comp, root)
  }))
  options.components = comps
  return options
}

async function registerComponent(config, root) {
  const options = await Promise.resolve(preprocess(config))
  return createComponent(options, root)
}

function register(comp) {
  customElements.define(comp.name, comp.ctor)
  return customElements.get(comp.name)
}

function createClass(options, root = null) {
  return class extends Base {
    constructor() {
      super()
      initOptions(options, this, this._update)
      if (this.created) {
        this.created.apply(this, [this])
      }
      this.attachShadow({ mode: 'open' })
    }

    get $router() {
      return root ? root.router : null
    }
  }
}

module.exports = { createComponent, registerComponent }
