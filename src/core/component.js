const Base = require('./base')

class Component extends Base {
  static renderFn = null

  static init(options = {}) {
    const { ast, render } = options
    if (render) this.renderFn = render
    return super.init(ast)
  }

  get classRef() {
    return Component
  }

  render() {
    super.render()
    if (this.classRef.renderFn) {
      this.classRef.renderFn.apply(this, [this])
    }
  }
}

module.exports = Component
