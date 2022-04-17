import Witchly from 'witchly'
import { ast } from './config'

class MyComponent extends Witchly.Component {
  init() {
    console.log('hiiii')
    return super.init()
  }
}

new Witchly({
  name: 'witchly-app',
  ast,
  render: (vm) => {
    const el = vm.getElement('.content')

    Witchly.component('my-component', {
      ast: {
        p: {
          attrs: { style: 'color: #8066cc' },
          children: 'hello from a render function!'
        }
      },
      render: (vm) => {
        vm.style = 'color: blue'
        vm.append('whoa')
      }
    }, MyComponent)

    vm.inject('my-component', el)
  }
})
