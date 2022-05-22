const Home = () => import('@/views/Home')
const About = () => import('@/views/About')

export default {
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
}
