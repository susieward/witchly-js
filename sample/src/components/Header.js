
const Title = (props) => {
  return (
    <div class="title-container">
      <h2 style="color: #aaa">{props.text}</h2>
    </div>
  )
}

export default class Header {
  name = 'app-header'
  placeholder = 'Type something'
  state = () => ({ textVal: '' })

  render() {
    return (
      <header>
        <Title text={this.textVal || this.message} />
        <div class="header-right">
          {this.textVal}
          <input
            id="input" 
            type="text"
            value={this.textVal}
            placeholder={this.placeholder}
            oninput={(e) => this.textVal = e.target.value} 
          />
          {this.clearable && <button onclick={() => this.clear()}>reset</button>}
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
  }

  get styles() {
    return (`
      header {
        display: grid;
        max-width: 100%;
        height: auto;
        letter-spacing: 0.03em;
        grid-auto-flow: column;
        align-content: center;
        padding: 20px 30px;
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
      }
      
      h2 {
        font-weight: 300;
        padding: 0;
        margin: 0;
        font-size: 20px;
        letter-spacing: 0.03em;
        line-height: 32px;
      }
    `)
  }
}
