const { parse, createElementJSX, createFragmentJSX } = require('./parser')
const { update } = require('./reactivity')
const { initOptions } = require('./options')
const { initStyles } = require('./styles')

module.exports = {
  parse,
  createElementJSX,
  createFragmentJSX,
  update,
  initOptions,
  initStyles
}
