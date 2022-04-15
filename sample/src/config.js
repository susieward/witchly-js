// abstract syntax tree
const ast = {
  div: {
    attrs: {
      id: 'app-container'
    },
    children: {
      header: {
        attrs: {
          id: 'header'
        },
        children: {
          h1: {
            attrs: {
              style: 'font-weight: 300; padding: 0 28px'
            },
            children: 'data-driven web components example'
          }
        }
      },
      main: {
        attrs: {
          class: 'main'
        },
        children: {
          aside: {
            attrs: {
              class: 'sidenav'
            },
            children: {
              ul: {
                children: {
                  li: {
                    children: 'I am a list item!'
                  }
                }
              }
            }
          },
          div: {
            attrs: {
              class: 'content'
            },
            children: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
          }
        }
      }
    }
  }
}


export const config = {
  ast,
  render: (vm) => {
    const el = vm.getElement('#header')
    el.append('hello from render function')
  }
}
