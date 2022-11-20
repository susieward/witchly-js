
export default class TextColors {
  name = 'text-colors'
  state = () => ({
    color: '',
    colors: ['pink', 'slateblue', 'skyblue', 'turquoise', 'hotpink']
  })

  createdCallback() {
    this.color = this.getRandomColor()
  }

  render() {
    return (
      <div style="display: grid; justify-content: flex-start;">
        <span class="color">
          I'm some text!
        </span>
        <div>
        Text colors (click to change):
          <ul>{this.colorsList}</ul>
          <p>Current color: <span class="color">{this.color}</span></p>
          <input id="new-color" type="text" value="" />
          <button onclick={() => this.addColor()}>
            add color
          </button>
          <p>
            <button onclick={() => this.randomColor()}>
              random text color
            </button>
          </p>
        </div>
        <style>{this.localStyles}</style>
      </div>
    )
  }

  get colorsList() {
    return this.colors.map(color => {
      return (
        <li>
          <button
            style={`color: ${color}; border: 1px solid ${color}`}
            onclick={() => this.color = color}>
            {color}
          </button>
        </li>
      )
    })
  }

  get localStyles() {
    return (
      `li {
        width: auto;
      }

      .color-text {
        display: inline-block;
        margin-right: 10px;
      }
      .color {
        display: inline-block;
        margin-right: 10px;
        color: ${this.color};
      }`
    )
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

  randomColor() {
    this.color = this.getRandomColor()
  }

  addColor() {
    if (this.input.value?.length > 0) {
      this.colors.push(this.input.value)
    }
  }
}
