const Home = () => import('@/views/Home')
const About = () => import('@/views/About')
const Examples = () => import('@/views/Examples')

export default {
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/examples',
      name: 'Examples',
      component: Examples
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/test/:id',
      name: 'Test',
      component: Home,
      props: true
    }
  ]
}
