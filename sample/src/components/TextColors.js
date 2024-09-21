
export default class TextColors {
  name = 'text-colors'
  state = () => ({
    color: '',
    colors: [
      'pink', 'slateblue', 'skyblue', 'turquoise', 
      'hotpink', 'darkturquoise'
    ]
  })

  createdCallback() {
    this.color = this.getRandomColor()
  }

  render() {
    return (
      <div style="display: grid;">
        <span class="color">
          I'm some text!
        </span>
        <div>
        Text colors (click to change):
        <map-items
          class="buttons"
          items={this.colors}
          callback={(color) => {
            return (
                <button
                  style={`color: ${color}; border: 1px solid ${color}`}
                  onclick={() => this.color = color}>
                  {color}
                </button>
            )
          }}>
          </map-items>
          <p>Current color: <span class="color">{this.color}</span></p>
          <div>
            <input id="new-color" type="text" value="" />
            <button onclick={() => this.addColor()}>
              add color
            </button>
          </div>
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

  get localStyles() {
    return (
      `li {
        width: auto;
      }

      .buttons {
        display: grid;
        max-width: 100%;
        grid-template-columns: repeat(auto-fit, minmax(min-content, 100px));
        grid-gap: 10px;
        margin: 10px 0;
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
