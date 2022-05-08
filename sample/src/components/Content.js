
export default class Content {
  constructor() {
    this.name = 'app-content'
    this.data = () => ({
      color: '#745fb5',
      colors: ['pink', 'linen', 'skyblue', 'turquoise', '#745fb5']
    })
  }

  get template() {
    return `
      <div class="content">
      <h2 data-if="${this.text}">${this.text}</h2>
        <p style="color: ${this.color};">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <div>
          <p>
          Text colors: ${[...this.colors.map(color => {
            return `<span style="color: ${color}">${color}</span>`
          })].join(', ')}
          </p>
          <p>
            Current color:
            <span style="color: ${this.color}">${this.color}</span>
          </p>
          <input id="new-color" type="text" value="" />
          <button onclick="addColor">add color</button>

          <p><button onclick="updateColor">random text color</button></p>

        </div>
      </div>
    `
  }

  getRandomColor() {
    let nextColor = this.colors[Math.floor(Math.random()*this.colors.length)]
    if (nextColor === this.color) {
      nextColor = this.getRandomColor()
    }
    return nextColor
  }

  updateColor() {
    this.color = this.getRandomColor()
  }

  addColor() {
    const input = this.getScopedElement('#new-color')
    if (input.value?.length > 0) {
      this.colors.push(input.value)
    }
  }
}
