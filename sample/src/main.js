import Witchly from 'witchly'
import Header from './components/Header'
import App from './components/App'

class MyComponent extends Witchly.Component {
  init() {
    // console.log('hiiii')
    return super.init()
  }
}

Witchly.component(Header.name, Header)

new Witchly({
  ...App,
  render: (vm) => {
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

    const el = vm.getScopedElement('.content')
    vm.inject('my-component', el)
  }
})
