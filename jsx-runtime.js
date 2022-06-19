const {
  createElement,
  createFragment,
} = require('./src')


function render(element, container) {
  return createElement(element, container)
}

module.exports = {
  jsx: createElement,
  jsxs: render,
  Fragment: createFragment
}
