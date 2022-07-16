
export default class CodeEditor {
  name = 'code-editor'
  defaultContent = '<p>Edit me!</p>'
  templateHTML = ''

  watch = {
    templateHTML: {
      handler(newVal) {
        this.$querySelector('#output').innerHTML = newVal
      }
    }
  }

  connectedCallback() {
    this.templateHTML = this.$querySelector('textarea').value
  }

  get template() {
    return (
      <div>
        <textarea
          id="editor"
          rows="10"
          oninput={(e) => this.templateHTML = e.target.value}>
          {this.defaultContent}
        </textarea>
        <button onclick={() => this.reset()}>reset</button>
        <div id="output"></div>
      </div>
    )
  }

  reset() {
    this.$querySelector('textarea').value = this.defaultContent
    this.templateHTML = this.defaultContent
  }

  get styles() {
    return {
      textarea: {
        minHeight: '200px',
        width: '100%',
        border: '1px solid #eee',
        marginTop: '20px',
        padding: '10px',
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
