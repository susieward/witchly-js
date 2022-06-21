
export default class TextColors {
  el = 'text-colors'
  state = () => ({
    color: '',
    colors: ['pink', 'linen', 'skyblue', 'turquoise', 'aqua']
  })

  get template() {
    const style = `color: ${this.color}`
    return (
      <div>
        <p style={style}>
          I'm some text!
        </p>
        <div>
          <p>Text colors: {this.colorsList}</p>
          <p>
            Current color:
            <span style={style}>{this.color}</span>
          </p>
          <input id="new-color" type="text" value="" />
          <button onclick={() => this.addColor()}>add color</button>
          <p>
            <button onclick={() => this.updateColor()}>
              random text color
            </button>
          </p>
        </div>
      </div>
    )
  }

  get colorsList() {
    return this.colors.map(color => {
      const style = `color: ${color}`
      return (
        <span
          onclick={() => this.setColor(color)}
          style={style}>
          {color}
        </span>
      )
    })
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

  setColor(color) {
    this.color = color
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
