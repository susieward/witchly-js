const Home = () => import('@/views/Home')
const About = () => import('@/views/About')
const Examples = () => import('@/views/Examples')

export default {
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/examples',
      name: 'examples',
      component: Examples
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
}
