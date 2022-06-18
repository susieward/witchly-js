
const ASTComponent = {
  el: 'ast-component',
  state() {
    return {
      text: 'hello from an AST-based component!',
      showMessage: false
    }
  },
  connectedCallback() {
    this.style = 'color: blue'
    this.$append('whoa')
  },
  get buttonText() {
    return this.showMessage ? 'hide message' : 'show message'
  },
  get template() {
    return {
      p: {
        children: [
          {
            button: {
              children: this.buttonText,
              listeners: {
                click() {
                  this.showMessage = !this.showMessage
                }
              }
            }
          },
          {
            p: {
              attrs: {
                style: 'color: #8066cc',
                'data-if': (this.showMessage === true)
              },
              children: this.text
            }
          }
        ]
      }
    }
  }
}

export default ASTComponent
