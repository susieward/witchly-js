const { createComponent, Router } = require('./core')

class Witchly {
  constructor(options) {
    this.router = new Router(options.router)
    const ctor = Witchly.component(options.render(), this)
    const el = document.getElementById('app')
    el.replaceWith(new ctor())
  }

  static component(options, root) {
    const comp = createComponent(options, root)
    return customElements.get(comp.name)
  }
}

module.exports = Witchly
