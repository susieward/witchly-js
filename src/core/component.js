const Base = require('./base')
const { initOptions } = require('./utils/options')
const { update } = require('./utils/reactivity')

class Component {
  constructor(options) {
    if (options.constructor.name === 'Function') {
      options = new options()
    }
    if (options.hasOwnProperty('components')) {
      Component.register(options.components)
    }
    this.name = options.name
    this.ctor = createClass(options)
  }

  static register(compObj) {
    const compNames = Object.keys(compObj)
    if (compNames.length > 0) {
      for (const name of compNames) {
        const comp = new this(compObj[name])
        customElements.define(comp.name, comp.init())
      }
    }
  }

  init() {
    return this.ctor
  }
}

function createClass(options) {
  return class extends Base {
    constructor() {
      super()
      this.options = options
      if (this.options) {
        initOptions(options, this, this.update)
      }
    }

    get _ast() {
      return this.ast
    }

    get renderFn() {
      return this.options?.render
    }

    get _template() {
      return this.template
    }

    $render() {
      super.$render()
      if (this.renderFn) {
        this.renderFn.apply(this, [this])
      }
    }

    update(prop, newVal, oldVal) {
      return update(prop, newVal, oldVal, this)
    }
  }
}

module.exports = Component
