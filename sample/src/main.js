import Witchly from '../../src'
const App = () => import('./App')
const Content = () => import('./components/Content')
import { Section, Subheader } from './components/Section'
import router from './router'
import store from './store'

Witchly.components([Content, Section, Subheader])

new Witchly({
  id: 'app',
  render: () => App,
  router,
  store
})
