const {
  createElement,
  createFragment,
} = require('./src')


function render(tag, props) {
  return createElement(tag, props)
}

module.exports = {
  jsx: createElement,
  jsxs: render,
  Fragment: createFragment
}
