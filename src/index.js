import { Component } from './core'

class Witchly {
  constructor(options) {
    Witchly.component(options.name, options)
  }

  static component(name, options, classRef = Component) {
    customElements.define(name, classRef.init(options))
  }
}

module.exports = Witchly
