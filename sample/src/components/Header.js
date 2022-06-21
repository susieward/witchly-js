class Title {
  el = 'app-title'

  static get observedAttributes() {
    return ['text']
  }

  get template() {
    return (
      <div class="title-container">
        <h1 onclick={() => this.$go('/')} style="color: #745fb5">
          witchly.js
        </h1>
      <h2 style="color: #aaa">{this.getAttribute('text')}</h2>
    </div>
    )
  }
}

export default class Header {
  el = 'app-header'
  state = () => ({ textVal: '' })
  defaultTitle = 'lightweight, hyper-flexible web components'
  components = { Title }

  connectedCallback() {
    this.inputEl.placeholder = 'Update title text'
  }

  get template() {
    return (
      <header id="header">
        <app-title
          text={this.textVal || this.defaultTitle}>
        </app-title>
        <div class="header-right">
          <input id="input" type="text" value="" oninput={(e) => this.inputHandler(e)} />
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

  inputHandler(e) {
    this.textVal = e.target.value
  }

  clear() {
    this.textVal = ''
    this.inputEl.value = ''
    this.inputEl.placeholder = 'Type something'
  }
}
