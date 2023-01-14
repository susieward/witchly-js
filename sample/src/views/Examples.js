const TextColors = () => import('@/components/TextColors')
const ListItems = () => import('@/components/ListItems')
const CodeEditor = () => import('@/components/CodeEditor')

export default class Examples {
  name = 'examples-view'
  components = { TextColors, ListItems, CodeEditor }
  title = 'Examples'
  state = () => ({
    items: [],
    message: '',
    examples: [
      {
        title: 'Text Colors (1)',
        config: { show: false },
        get template() {
          return <text-colors></text-colors>
        }
      },
      {
        title: 'CodeEditor',
        config: { show: false },
        get template() {
          return <code-editor></code-editor>
        }
      },
      {
        title: 'List Items',
        config: { show: false },
        get template() {
          return (
            <div>
              <button onclick={() => this.addListItem('hello!')}>
                add item
              </button>
              <list-items
                onmessage={(e) => this.message = e.detail}
                onremove={(e) => this.removeItem(e.detail)}
                items={this.items}>
              </list-items>
            </div>
          )
        }
      },
      {
        title: 'Text Colors (2)',
        config: { show: false },
        get template() {
          return <text-colors></text-colors>
        }
      }
    ]
  })

  createdCallback() {
    this.addListItem('hello!')
    if (this.$route.params?.show != null) {
      const comp = this.examples[Number(this.$route.params.show)]
      comp.config.show = true
    }
  }

  render() {
    return (
      <app-content title-text={this.title}>
      {this.$route.params.message}
        <span data-if={Boolean(this.message)}>
          {this.message}
        </span>
        <div id="examples">
          {this.comps}
        </div>
      </app-content>
    )
  }

  get comps() {
    return this.examples.map(comp => {
      return (
        <div class="example">
          <span
            class="link"
            onclick={() => this.toggleComp(comp)}>
            {comp.title}
          </span>
          {(comp.config.show === true)
            ? <div class="comp">{comp.template}</div>
            : null}
        </div>
      )
    })
  }

  toggleComp(comp) {
    return comp.config.show = !comp.config.show
  }

  addListItem(text) {
    let uuid = self.crypto.randomUUID()
    const index = uuid
    this.items.push(`${text} ${index}`)
  }

  removeItem(index) {
    console.log(index)
    this.items.splice(index, 1)
  }

  get styles() {
    return (`
        .link {
          color: var(--accent-color);
          cursor: pointer;
          margin-right: auto;
        }

        #examples {
          display: grid;
        }

        .comp {
          border-left: 1px solid #eee;
          padding: 0 0 0 20px;
          margin-left: 5px;
          margin-top: 10px;
        }
    `)
  }
}
