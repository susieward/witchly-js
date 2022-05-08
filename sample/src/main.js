import Witchly from 'witchly'
import App from './components/App'
import ASTComponent from './components/ASTExample'

class MyComponent extends Witchly.Component {
  init() {
    console.log('hi!')
    return super.init()
  }
}

new Witchly({
  ...App,
  render: (vm) => {
    Witchly.component(ASTComponent, MyComponent)
    const el = vm.getScopedElement('.content')
    vm.inject('ast-component', el)
  }
})
