import Witchly from 'witchly'
import App from './App'
import Content from './components/Content'
import './main.css'
import router from './router'

// global component registration
Witchly.component(Content)

new Witchly({
  id: 'app',
  render: () => App,
  router
})
