
export default function About() {
  this.name = 'about-view'
  this.title = 'About'
  this.template = function() {
    return (
      <app-content title-text={this.title}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat.
        </p>
        <button style="margin-right: auto" onclick={() => this.$go('/')}>
          home
        </button>
      </app-content>
    )
  }
}
