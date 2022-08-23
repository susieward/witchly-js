const CodeEditor = () => import('@/components/CodeEditor')

export default {
  name: 'home-view',
  components: { CodeEditor },
  connectedCallback() {
    this.$root.addEventListener('hi', this.hi)
  },
  disconnectedCallback() {
    this.$root.removeEventListener('hi', this.hi)
  },
  render() {
    return (
      <app-content title-text="Home">
        <code-editor></code-editor>
        <button id="button" onclick={() => this.$emit('hi', 'hi')}>hi</button>
      </app-content>
    )
  },
  hi(e) {
    return this.$root.shadowRoot.firstElementChild.append(e.detail)
  }
}
