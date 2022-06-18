
export default class Header {
  constructor() {
    this.el = 'app-header'
    this.state = () => ({ textVal: '' })
    this.defaultTitle = 'lightweight, hyper-flexible web components'
    this.components = {
      Title:  class Title {
        el = 'app-title'
        color = '#745fb5'

        static get observedAttributes() {
          return ['text']
        }

        get template() {
          return `
            <div class="title-container">
              <h1 onclick="$go('/')" style="color: ${this.color}">
                witchly.js
              </h1>
            <h2 style="color: #aaa">${this.text}</h2>
          </div>`
        }
      }
    }
  }

  connectedCallback() {
    this.inputEl.placeholder = 'Update title text'
  }

  get template() {
    return `
      <header id="header">
        <app-title
          text="${this.textVal || this.defaultTitle}">
        </app-title>
        <div class="header-right">
          <input id="input" type="text" :value="textVal" />
          <button data-if="${this.clearable}" onclick="clear">
            reset
          </button>
        </div>
      </header>
    `
  }

  get inputEl() {
    return this.$querySelector('#input')
  }

  get clearable() {
    return this.textVal.length > 0
  }

  clear() {
    this.textVal = ''
    this.inputEl.placeholder = 'Type something'
  }
}
