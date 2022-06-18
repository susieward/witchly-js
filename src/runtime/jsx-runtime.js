const {
  createElement,
  createFragment,
} = require('../core')


function render(element, container) {
  return createElement(element, container)
}

module.exports = {
  jsx: createElement,
  jsxs: render,
  jsxFrag: createFragment
}
