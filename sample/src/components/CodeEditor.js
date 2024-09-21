
export default class CodeEditor {
  name = 'code-editor'
  state = () => ({ outputHTML: '' })

  bgColor = 'mistyrose'
  color = 'salmon'
  
  watch = {
    outputHTML: {
      handler(newVal) {
        this.output.innerHTML = newVal
        if (newVal === this.defaultContent && this.textarea.value !== newVal) {
          this.textarea.value = newVal
        }
      }
    }
  }

  connectedCallback() {
    this.outputHTML = this.defaultContent
  }

  render() {
    return (
      <section>
        <div id="output"></div>
        <textarea
          id="textarea"
          value=""
          oninput={(e) => this.outputHTML = e.target.value}>
        </textarea>
        <div style="display: grid; grid-auto-flow: column; grid-gap: 2rem; justify-content: flex-start;">
          <button onclick={() => this.outputHTML = ''}>clear</button>
          {this.showReset && <button onclick={() => this.reset()}>reset</button>}
        </div>
      </section>
    )
  }

  reset() {
    this.outputHTML = this.defaultContent
  }

  get showReset() {
    return this.outputHTML !== this.defaultContent
  }

  get textarea() {
    return this.$querySelector('#textarea')
  }

  get output() {
    return this.$querySelector('#output')
  }

  get defaultContent() {
    return this.$route.name !== 'Test'
      ? (
`<div id="editor">
  <h2>Hello</h2>
  <p>Some example text</p>
</div>

<style>
  #editor {
    background-color: ${this.bgColor};
    display: grid;
    align-content: space-between;
    color: ${this.color}; 
    padding: 20px; 
    border-radius: 8px;
  }
  #editor h2 {
    margin: 0;
  }
</style>`)
    : ''
  }

  get styles() {
    return {
      textarea: {
        display: 'block',
        minHeight: '370px',
        width: '100%',
        border: '1px solid #eee',
        borderRadius: '0.3em',
        margin: '20px 0',
        padding: '20px',
        letterSpacing: '0.03em',
        fontSize: '16px',
        fontFamily: 'var(--font-family)'
      },
      ul: {
        listStyleType: '~ ',
        margin: 0,
        padding: '0 30px'
      },
      li: {
        margin: 0,
        padding: 0
      },
      a: {
        color: 'slateblue',
        textDecoration: 'none',
        letterSpacing: '0.03em'
      }
    }
  }
}
