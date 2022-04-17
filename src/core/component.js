const Base = require('./base')

class Component {
  constructor(options) {
    this.dom = class extends Base {}
    this.dom.ast = options.ast
    this.dom.renderFn = options.render || null
  }

  init() {
    return this.dom
  }
}

module.exports = Component
