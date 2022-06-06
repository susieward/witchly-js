const Examples = () => import('@/components/Examples')

export default class Home {
  name = 'home-view'
  components = { Examples }
  get template() {
    return `
      <app-examples></app-examples>
    `
  }
}
