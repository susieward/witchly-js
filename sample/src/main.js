import Witchly from 'witchly'
import App from './App'
import './main.css'
import router from './router'

new Witchly({
  render: () => App,
  router
})
