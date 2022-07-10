const CodeEditor = () => import('@/components/CodeEditor')

export default {
  name: 'home-view',
  components: { CodeEditor },
  get template() {
    return (
      <app-content title-text="Home">
        <code-editor></code-editor>
      </app-content>
    )
  }
}
