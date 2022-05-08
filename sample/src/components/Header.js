
export default class Header {
  constructor() {
    this.name = 'app-header'
    this.data = () => ({
      title: 'minimal, flexible web components',
      inputVal: '',
      color: '#745fb5'
    })
  }

  render() {
    this.input.placeholder = 'Type something'
  }

  get input() {
    return this.getScopedElement('#input')
  }

  get clearable() {
    return (this.input?.value?.length > 0)
  }

  get template() {
    return `
      <header id="header">
      <div style="display: grid; justify-content: flex-start; grid-auto-flow: column; align-content: center; grid-column-gap: 15px">
        <h1 style="color: ${this.color}">witchly.js</h1> //
        <h2 style="color: #aaa">${this.title}</h2>
        </div>
        <div style="display: grid; margin-left: auto; justify-content: flex-end; align-content: center; grid-auto-flow: column; grid-column-gap: 15px">
        <span style="font-family: Menlo">${this.inputVal}</span>
        <input id="input" type="text" oninput="setInputVal" value="" />
        <button onclick="updateTitle">update title</button>
        <button data-if="${this.clearable}" onclick="clear">
          reset
        </button>
        </div>
      </header>`
  }

  updateTitle() {
    this.title = this.inputVal
  }

  clear() {
    this.input.value = ''
    this.inputVal = ''
    this.input.placeholder = 'Type something'
    this.title = 'minimal, flexible web components'
  }

  setInputVal(e) {
    if (e.isComposing) return
    this.inputVal = e.target.value
  }
}
