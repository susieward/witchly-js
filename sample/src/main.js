import Witchly from 'witchly'
const App = () => import('./App')
const Content = () => import('./components/Content')
import './main.css'
import router from './router'

// global component registration
Witchly.component(Content)

new Witchly({
  id: 'app',
  render: () => App,
  router
})
