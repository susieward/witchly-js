import { Base } from './base'

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

export class Witchly {
  constructor(options) {
    Witchly.component(options.name, options)
  }

  static component(name, options, classRef = Component) {
    customElements.define(name, classRef.init(options))
  }
}
