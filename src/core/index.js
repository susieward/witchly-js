const Router = require('./router')
const { createComponent, registerComponents } = require('./components')
const { createElementJSX, createFragmentJSX } = require('./parser')

module.exports = {
  Router,
  createComponent,
  registerComponents,
  createElementJSX,
  createFragmentJSX
}
