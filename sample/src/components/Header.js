const Header = {
  name: 'app-header',
  data() {
    return {
      title: 'witchly.js: configuration-driven web components',
      inputVal: '',
      color: '#745fb5',
      colors: ['pink', 'linen', 'skyblue', 'turquoise', '#745fb5']
    }
  },
  get template() {
    const clearable = (this.inputVal.length > 0)
    return `
      <header id="header">
        <h1 style="color: ${this.color}; font-weight: 300; padding: 0 28px; font-size: 28px;">
          <span>${this.title}</span>
          <span>${this.inputVal}</span>
          <input id="input" type="text" oninput="setInputVal" value="${this.inputVal}" />
          <button onclick="updateMessage">update title</button>
          <button data-if="${clearable}" onclick="clearMessage">clear</button>
        </h1>
        <div>
        ${this.colors.map(color => {
          return `<span style="color: ${color}">${color}</span>`
        })}
        <input id="new-color" type="text" value="" />
        <button onclick="addColor">add color</button>
        <button onclick="updateColor">update color</button>
        <span>
          Current color: <span style="color: ${this.color}">${this.color}</span>
          </span>
        </div>
      </header>
    `
  },
  getRandomColor() {
    return this.colors[Math.floor(Math.random()*this.colors.length)]
  },
  updateColor() {
    this.color = this.getRandomColor()
  },
  updateMessage() {
    const input = this.getScopedElement('#input')
    const message = input.value
    this.title = message
  },
  addColor() {
    const input = this.getScopedElement('#new-color')
    if (input.value?.length > 0) {
      this.colors.push(input.value)
    }
  },
  clearMessage() {
    const input = this.getScopedElement('#input')
    input.value = ''
    this.inputVal = ""
    this.title = 'witchly.js: configuration-driven web components'
  },
  setInputVal(e) {
    if (e.isComposing) return
    this.inputVal = e.target.value
  }
}

export default Header
