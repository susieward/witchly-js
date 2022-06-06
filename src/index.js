const { ComponentFactory, Router } = require('./core')

class Witchly {
  constructor(options) {
    if (options.router) {
      this.router = new Router(options.router, this)
    }
    const ctor = Witchly.component(options.render(), this)
    const el = document.getElementById('app')
    el.replaceWith(new ctor())
  }

  static component(options, root) {
    const comp = ComponentFactory.create(options, root)
    return comp._ctor
  }
}

module.exports = Witchly
