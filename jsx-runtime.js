const {
  createElementJSX,
  createFragmentJSX,
} = require('./src')


function renderJSX(tag, props) {
  return createElementJSX(tag, props)
}

module.exports = {
  jsx: createElementJSX,
  jsxs: renderJSX,
  Fragment: createFragmentJSX
}
