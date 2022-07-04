
export default () => {
  const name = 'about-view'
  const title = 'about'
  const template = (vm) => {
    return (
      <app-content title-text={title}>
        <div>
        <p>
          <code>
            Something will go here!
          </code>
          </p>
        <button onclick={() => vm.$go('/')}>home</button>
        </div>
      </app-content>
    )
  }
  return { name, template }
}
