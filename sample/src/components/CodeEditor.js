
export default class CodeEditor {
  name = 'code-editor'
  defaultContent = '<p>Edit me!</p>'
  outputHTML = ''

  watch = {
    outputHTML: {
      handler(newVal) {
        this.$querySelector('#output').innerHTML = newVal
      }
    }
  }

  connectedCallback() {
    this.outputHTML = this.$querySelector('textarea').value
  }

  render() {
    return (
      <div>
        <textarea
          rows="10"
          oninput={(e) => this.outputHTML = e.target.value}>
          {this.defaultContent}
        </textarea>
        <button onclick={() => this.reset()}>reset</button>
        <div id="output"></div>
      </div>
    )
  }

  reset() {
    this.$querySelector('textarea').value = this.defaultContent
    this.outputHTML = this.defaultContent
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
