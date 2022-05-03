const Base = require('./base')
const { initOptions } = require('./reactivity-utils')

class Component {
  constructor(options) {
    this.dom = createClass(options)
  }
  init() {
    return this.dom
  }
}

function createClass(options) {
  return class extends Base {
    constructor() {
      super()
      this.options = options
      if (this.options && !this.options.ast) {
        initOptions(options, this, this.update)
      }
    }

    get ast() {
      return this.options?.ast
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

function update(prop, newVal, oldVal, vm) {
  const dom = vm.parse(vm.template)
  const oldDom = vm.firstChild
  const args = [null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null]

  let exp = `.//*[contains(text(),"${newVal}")] | .//*[@*[contains(., "${newVal}") and not(name()="data-id" or name()="value" or name()="id")]] | .//*[@data-if]`

  const output = document.evaluate(exp, dom, ...args)
  let el = output.iterateNext()
  let matches = []

  while (el) {
    const currExp = `.//*[name()="${el.localName}" and @data-id="${el.dataset.id}"]`
    const domOutput = document.evaluate(currExp, vm.firstChild, ...args)
    let match = domOutput.iterateNext()
    if (match && !match.isEqualNode(el)) {
      matches.push({ newEl: el, oldEl: match })
    }
    el = output.iterateNext()
  }
  if (matches.length > 0) {
    matches = matches.reverse()
    for (const [index, obj] of matches.entries()) {
      const { oldEl, newEl } = obj
      if (index > 0) {
        const prev = matches[index - 1]
        if (oldEl.contains(prev.newEl)) continue
      }
      oldEl.replaceWith(newEl)
    }
  } else {
    const domChanged = !oldDom.isEqualNode(dom)
    if (domChanged) {
      vm.firstChild.replaceWith(dom)
    }
  }
}

module.exports = Component
