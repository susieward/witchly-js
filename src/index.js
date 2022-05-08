const { Component } = require('./core')

class Witchly {
  static Component = Component

  constructor(options) {
    const ctor = Witchly.component(options)
    const el = document.getElementById('app')
    el.replaceWith(new ctor())
  }

  static components(comps = [], classRef = Component) {
    if (comps?.length > 0) {
      for (const comp of comps) {
        this.component(comp, classRef)
      }
    }
  }

  static component(options, classRef = Component) {
    const comp = new classRef(options)
    customElements.define(comp.name, comp.init())
    return customElements.get(comp.name)
  }
}

module.exports = Witchly
