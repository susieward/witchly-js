const CodeEditor = () => import('@/components/CodeEditor')

export default class HomeView {
  components = { CodeEditor }
  state = () => ({ paramsMessage: '' })

  get id() {
    return this.$route.params.id
  }

  connectedCallback() {
    this.$root.addEventListener('hi', this.hi)
  }

  disconnectedCallback() {
    this.$root.removeEventListener('hi', this.hi)
  }

  render() {
    return (
      <div>
      <strong data-if={this.id || this.paramsMessage}>
        <span data-if={this.id}>Id: {this.id}.</span>
        <span data-if={this.paramsMessage}>
          Params message: {this.paramsMessage}
        </span>
      </strong>
        <button style="margin-right: auto" onclick={() => this.$go('/test/3')}>
          test: 3
        </button>
      <p>
        <input type="text" oninput={(e) => this.paramsMessage = e.target.value} />
        {this.paramsMessage}
        <button id="params-btn" onclick={() => this.navigate()}>
          examples: {this.paramsMessage}
        </button>
        </p>
        <code-editor></code-editor>
        <button id="button" onclick={() => this.$emit('hi', 'hi')}>hi</button>
        <span data-if={this.paramsMessage}>
          {this.paramsMessage}
        </span>
      </div>
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
