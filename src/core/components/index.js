import BaseComponent from './base'
import { _resolve } from './helpers/utils'

async function createComponent(_options, root = null) {
  const options = await _preprocess(_options, root)
  let name = options?.name || options?.constructor?.name
  if (!name) {
    throw new Error('createComponent: Component name not found')
  }
  let comp = {}
  if (!customElements.get(name)) {
    comp = {
      name,
      _ctor: _createCtor(options, root)
    }
    customElements.define(comp.name, comp._ctor)
  }
  return comp
}

async function _preprocess(_options, root) {
  const options = await _resolve(_options)
  const compObj = options.components || options.constructor?.components
  if (compObj) {
    const comps = Object.values(compObj)
    if (comps.length > 0) {
      const promises = comps.map(comp => createComponent(comp, root))
      const results = await Promise.all(promises).catch(err => console.error(err))
      options._children = results
    }
  }
  return options
}

async function registerComponents(compOption = {}, root = null) {
  const values = Object.values(compOption)
  if (values.length === 0) return

  const promises = values.map(comp => createComponent(comp, root))
  return Promise.all(promises).catch(err => console.error(err))
}

function _createCtor(options, root = null) {
  return class extends BaseComponent {
    static #_styleSheets = null

    static get styleSheets() {
      return this.#_styleSheets
    }

    static set styleSheets(val) {
      if (!this.#_styleSheets) {
        this.#_styleSheets = val
      }
      return true
    }

    static get observedAttributes() {
      return (options?.observedAttributes || options?.constructor?.observedAttributes)
        || []
    }

    get _options() {
      return options
    }

    get _root() {
      return root
    }
  }
}

export { createComponent, registerComponents }
