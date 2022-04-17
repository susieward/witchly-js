const { Component } = require('./core')

class Witchly {
  static Component = Component

  constructor(options) {
    Witchly.component(options.name, options)
  }

  static component(name, options, classRef = Component) {
    const comp = new classRef(options)
    customElements.define(name, comp.init())
  }
}

module.exports = Witchly
