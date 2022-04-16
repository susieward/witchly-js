import Witchly from '../../src/index.js'
import { ast } from './config'

new Witchly({
  name: 'witchly-app',
  ast,
  render: (vm) => {
    const content = vm.getElement('.content')
    const newEl = vm.parse({
      p: {
        attrs: { style: 'color: #8066cc' },
        children: 'hello from a render function!'
      }
    })
    content.append(newEl)
  }
})
