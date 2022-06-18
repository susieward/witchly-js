import Witchly from 'witchly'
import App from './App'
import Content from './components/Content'
import './main.css'
import router from './router'

Witchly.component(Content)

new Witchly({
  render: () => App,
  router
})
