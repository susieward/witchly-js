import {
  createElementJSX,
  createFragmentJSX,
} from './src'


function renderJSX(tag, props) {
  return createElementJSX(tag, props)
}

const jsx = createElementJSX
const jsxs = renderJSX
const Fragment = createFragmentJSX

export { jsx, jsxs, Fragment }
