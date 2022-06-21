
export default () => {
  const el = 'about-view'
  const title = 'about'
  const template = (vm) => {
    return (
      <content-element title-text={title}>
        <div>
        <p>
          <code>
            Something will go here!
          </code>
          </p>
        <button onclick={() => vm.$go('/')}>home</button>
        </div>
      </content-element>
    )
  }
  return { el, template }
}
