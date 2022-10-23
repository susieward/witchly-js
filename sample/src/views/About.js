
export default function About() {
  this.name = 'about-view'
  this.title = 'About'
  this.goHome = function() {
    if (confirm('Go back to home page?')) {
      return this.$go('/')
    }
  }
  this.render = function() {
    return (
      <app-content title-text={this.title}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat.
        </p>
        <button style="margin-right: auto" onclick={() => this.goHome()}>
          home
        </button>
      </app-content>
    )
  }
}
