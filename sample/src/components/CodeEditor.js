
export default class CodeEditor {
  name = 'code-editor'
  defaultContent = '<p>Edit me!</p>'
  watch = {
    templateHTML: {
      handler() {
        const children = this.templateEl.content.cloneNode(true)
        this.$querySelector('#output').replaceChildren(children)
      }
    }
  }

  connectedCallback() {
    this.init()
  }

  get template() {
    return (
      <div>
        <textarea
          value=""
          id="editor"
          rows="10"
          oninput={(e) => this.templateHTML = e.target.value}>
        </textarea>
        <button onclick={() => this.init()}>reset</button>
        <template id="code-temp"></template>
        <div id="output"></div>
      </div>
    )
  }

  get templateEl() {
    return this.$querySelector('#code-temp')
  }

  get templateHTML() {
    return this.templateEl.innerHTML
  }

  set templateHTML(val) {
    return this.templateEl.innerHTML = val
  }

  init() {
    this.$querySelector('textarea').value = this.defaultContent
    this.templateHTML = this.defaultContent
  }

  get styles() {
    return {
      textarea: {
        minHeight: '200px',
        width: '100%',
        border: '1px solid #eee',
        'margin-top': '20px',
        padding: '10px',
        letterSpacing: '0.03em',
        fontSize: '16px'
      },

      ul: {
        'list-style-type': '~ ',
        margin: 0,
        padding: '0 30px'
      },

      li: {
        margin: 0,
        padding: 0
      },

      a: {
        color: 'slateblue',
        'text-decoration': 'none',
        'letter-spacing': '0.03em'
      }
    }
  }
}
