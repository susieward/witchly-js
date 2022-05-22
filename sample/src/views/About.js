
export default class About {
  constructor() {
    this.name = 'about-view'
  }

  home() {
    return this.$router.push('/')
  }

  get template() {
    return `
        <main class="main">
          <h2>about!</h2>
          <main class="main">
            <button onclick="home">home</button>
        </main>
    `
  }
}
