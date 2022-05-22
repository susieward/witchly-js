
const Title = {
  name: 'app-title',
  data: () => ({
    color: '#745fb5',
    title: 'lightweight, hyper-flexible web components'
  }),
  props: {
    text: {
      type: String
    }
  },
  get template() {
    return `
      <div class="title-container">
        <h1 onclick="home" style="color: ${this.color}">witchly.js</h1> //
        <h2 style="color: #aaa">${this.title}</h2>
        <button onclick="about">about</button>
      </div>
    `
  },
  connected() {
    if (this.text) {
      this.title = this.text
    }
  },
  about() {
    return this.$router.push('/about')
  },
  home() {
    return this.$router.push('/')
  }
}

export default class Header {
  constructor() {
    this.name = 'app-header'
    this.components = { Title }
    this.data = () => ({ inputVal: '' })
    this.divStyle =  `
        display: grid;
        margin-left: auto;
        justify-content: flex-end;
        align-content: center;
        grid-auto-flow: column;
        grid-column-gap: 15px
    `
  }

  connected() {
    this.input.placeholder = 'Type something'
  }

  get input() {
    return this.$querySelector('#input')
  }

  get clearable() {
    return (this.input?.value?.length > 0)
  }

  get template() {
    return `
      <header id="header">
        <app-title data-text="${this.inputVal}"></app-title>
        <div style="${this.divStyle}">
          <input id="input" type="text" oninput="setInputVal" value="" />
          <button data-if="${this.clearable}" onclick="clear">
            reset
          </button>
        </div>
      </header>
    `
  }

  clear() {
    this.input.value = ''
    this.inputVal = ''
    this.input.placeholder = 'Type something'
  }

  setInputVal(e) {
    if (e.isComposing) return
    this.inputVal = e.target.value
  }
}
