
export default class CodeEditor {
  defaultContent = '<p>Edit me!</p>'
  state = () => ({ outputHTML: '' })

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
      <div>
        <textarea
          rows="10"
          oninput={(e) => this.outputHTML = e.target.value}>
        </textarea>
        <div id="output"></div>
        <button onclick={() => this.reset()}>reset</button>
        <p data-if={Boolean(this.outputHTML)}>hi</p>
      </div>
    )
  }

  reset() {
    this.outputHTML = this.defaultContent
  }

  get textarea() {
    return this.$querySelector('textarea')
  }

  get output() {
    return this.$querySelector('#output')
  }

  get styles() {
    return {
      textarea: {
        display: 'block',
        minHeight: '200px',
        width: '100%',
        maxWidth: '800px',
        border: '1px solid #eee',
        borderRadius: '0.3em',
        margin: '20px 0',
        padding: '20px',
        letterSpacing: '0.03em',
        fontSize: '16px'
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
