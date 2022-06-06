
export default class TextColors {
  name = 'text-colors'
  state = () => ({
    color: '',
    colors: ['pink', 'linen', 'skyblue', 'turquoise', 'aqua']
  })

  get template() {
    return (`
      <div>
        <p style="color: ${this.color};">
          I'm some text!
        </p>
        <div>
          <p>Text colors: ${this.colorsList}</p>
          <p>
            Current color:
            <span style="color: ${this.color}">${this.color}</span>
          </p>
          <input id="new-color" type="text" value="" />
          <button onclick="addColor">add color</button>
          <p><button onclick="updateColor">set random text color</button></p>
        </div>
      </div>
    `)
  }

  get colorsList() {
    return this.colors.map(color => {
      return `<span style="color: ${color}">${color}</span>`
    }).join(', ')
  }

  get input() {
    return this.$querySelector('#new-color')
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
    if (this.input.value?.length > 0) {
      this.colors.push(this.input.value)
    }
  }
}
