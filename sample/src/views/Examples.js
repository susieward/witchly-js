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
        title: 'Text Colors',
        config: { show: false },
        get content() {
          return <text-colors></text-colors>
        }
      },
      {
        title: 'Text Colors (2)',
        config: { show: false },
        get content() {
          return <text-colors></text-colors>
        }
      },
      {
        title: 'Code Editor',
        config: { show: false },
        get content() {
          return <code-editor></code-editor>
        }
      },
      {
        title: 'List Items',
        config: { show: false },
        get content() {
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
      }
    ]
  })

  createdCallback() {
    this.addListItem('hello!')
    console.log(this.items)
    if (this.$route.params?.show !== null) {
      const comp = this.examples[Number(this.$route.params.show)]
      if (comp) comp.config.show = true
    }
  }

  render() {
    return (
      <app-content title-text={this.title}>
      {this.$route.params.message}
        {this.message && <p>{this.message}</p>}
        <button onclick={() => this.closeAll()}>close all</button>
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
          <h4 onclick={() => this.toggleComp(comp)}>
            {comp.title}
          </h4>
          {comp.config.show && <div class="comp">{comp.content}</div>}
        </div>
      )
    })
  }

  toggleComp(comp) {
    return comp.config.show = !comp.config.show
  }

  closeAll() {
    for (const comp of this.examples) {
      comp.config.show = false
    }
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
        #examples {
          display: grid;
          align-content: flex-start;
          grid-gap: 1rem;
          grid-template-columns: repeat(auto-fit, minmax(20vw, 1fr));
        }

        h4 {
          color: var(--accent-color);
          cursor: pointer;
          margin: 0 auto 0 0;
          font-weight: 500;
        }

        .example {
          border: var(--content-border);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: auto;
        }
    `)
  }
}
