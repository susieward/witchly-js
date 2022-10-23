import Witchly from 'witchly'
const App = () => import('./App')
const Content = () => import('./components/Content')
import { Section, Subheader } from './components/Section'
import router from './router'
import './main.css'

Witchly.component(Content)
Witchly.component(Section)
Witchly.component(Subheader)

new Witchly({
  id: 'app',
  render: () => App,
  router
})
