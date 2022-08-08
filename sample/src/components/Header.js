
const Title = (props) => {
  return (
    <div class="title-container">
      <h1 style="color: #745fb5; cursor: pointer" onclick={() => props.onclick()}>
        witchly.js
      </h1>
      <h2 style="color: #aaa">{props.text}</h2>
    </div>
  )
}

export default class Header {
  name = 'app-header'
  state = () => ({ textVal: '' })
  defaultTitle = 'lightweight, hyper-flexible web components'

  connectedCallback() {
    this.inputEl.placeholder = 'Type something'
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

  get styles() {
    return (`
      #header {
        display: grid;
        min-width: 100%;
        letter-spacing: 0.03em;
        grid-auto-flow: column;
        align-content: center;
        background-color: var(--content-bg-color);
        border-bottom: var(--content-border);
        padding: 20px 28px;
      }

      .header-right {
        display: grid;
        margin-left: auto;
        justify-content: flex-end;
        align-content: center;
        grid-auto-flow: column;
        grid-column-gap: 15px;
      }

      .title-container {
        display: grid;
        justify-content: flex-start;
        grid-auto-flow: column;
        align-content: center;
        grid-column-gap: 15px;
      }`
    )
  }
}
