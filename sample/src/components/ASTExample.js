
const ASTComponent = {
  name: 'ast-component',
  data() {
    return {
      text: 'hello from an AST-based component!',
      showMessage: false
    }
  },
  get buttonText() {
    return this.showMessage ? 'hide message' : 'show message'
  },
  get ast() {
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
  },
  render() {
    this.style = 'color: blue'
    this.append('whoa')
  }
}

export default ASTComponent
