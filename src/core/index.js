const WitchlyRouter = require('./router')
const { createComponent } = require('./components')
const { createElementJSX, createFragmentJSX } = require('./utils/parser')

module.exports = {
  WitchlyRouter,
  createComponent,
  createElementJSX,
  createFragmentJSX
}
