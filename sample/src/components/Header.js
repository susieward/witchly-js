
const Title = (props) => {
  return (
    <div class="title-container">
      <h1 style="color: #745fb5">witchly.js</h1>
      <h2 style="color: #aaa">{props.text}</h2>
    </div>
  )
}

export default class Header {
  el = 'app-header'
  state = () => ({ textVal: '' })
  defaultTitle = 'lightweight, hyper-flexible web components'

  connectedCallback() {
    this.inputEl.placeholder = 'Update title text'
  }

  get template() {
    return (
      <header id="header">
        <Title
          onclick={() => this.$go('/')}
          text={this.textVal || this.defaultTitle}>
        </Title>
        <div class="header-right">
          <input id="input" type="text" oninput={(e) => this.textVal = e.target.value} />
          <button
            data-if={this.clearable}
            onclick={() => this.clear()}>
            reset
          </button>
        </div>
      </header>
    )
  }

  get inputEl() {
    return this.$querySelector('#input')
  }

  get clearable() {
    return this.textVal?.length > 0
  }

  clear() {
    this.textVal = ''
    this.inputEl.value = ''
    this.inputEl.placeholder = 'Type something'
  }
}
