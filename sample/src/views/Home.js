const CodeEditor = () => import('@/components/CodeEditor')

export default class Home {
  name = 'home-view'
  components = { CodeEditor }
  state = () => ({ paramsMessage: '' })
  // props = ['id']

  get id() {
    return this.$route.params.id
  }

  connectedCallback() {
    this.$root.addEventListener('hi', this.hi)
    // this.paramsMessage = 'blah'
  }

  disconnectedCallback() {
    this.$root.removeEventListener('hi', this.hi)
  }

  render() {
    return (
      <app-content title-text="Home">
      Id: {this.id}. {this.paramsMessage} params message
      <p>
        <button onclick={() => this.$go('/test/3')}>
          test: 3
        </button>
      </p>
      <p>
        <input type="text" oninput={(e) => this.paramsMessage = e.target.value} />
        {this.paramsMessage}
        </p>
      <p>
        <button id="params-btn" onclick={() => this.navigate()}>
          examples: {this.paramsMessage}
        </button>
        </p>
        <code-editor></code-editor>
        <button id="button" onclick={() => this.$emit('hi', 'hi')}>hi</button>
        {this.paramsMessage}
      </app-content>
    )
  }

  navigate() {
    this.$router.push({
      path: '/examples',
      params: { message: this.paramsMessage }
    })
  }

  hi(e) {
    return this.$root.shadowRoot.firstElementChild.prepend(e.detail)
  }
}
