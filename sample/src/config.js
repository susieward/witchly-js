const header = {
  attrs: {
    id: 'header'
  },
  children: [{
    h1: {
      attrs: {
        style: 'font-weight: 300; padding: 0 28px; font-size: 28px;'
      },
      children: 'witchly.js: configuration-driven web components'
    }
  }]
}

const button = {
  children: 'click me to do a thing',
  listeners: {
    click: (e, vm) => {
      const el = vm.getScopedElement('ul')
      const li = document.createElement('li')
      li.append('hello!')
      el.append(li)
    }
  }
}

const aside = {
    attrs: {
      class: 'sidenav'
    },
    children: [
      { button },
      {
        ul: {
          children: [{
            li: {
              children: 'I am a list item!'
            }
          }]
        }
      }
    ]
}

const main = {
  attrs: {
    class: 'main'
  },
  children: [
    {aside},
    {div: {
      attrs: {
        class: 'content'
      },
      children: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    }
  }
]
}

// abstract syntax tree
export const ast = {
  div: {
    attrs: {
      id: 'app-container'
    },
    children: [{ main }]
  }
}
