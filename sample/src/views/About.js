
export default () => {
  const name = 'about-view'
  const title = 'About'
  const template = (vm) => {
    return (
      <app-content title-text={title}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat.
        </p>
        <button style="margin-right: auto" onclick={() => vm.$go('/')}>home</button>
      </app-content>
    )
  }
  return { name, template }
}
