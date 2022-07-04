const TextColors = () => import('@/components/TextColors')
const ListItems = () => import('@/components/ListItems')
const ASTComponent = () => import ('@/components/ASTComponent')

export default class Examples {
  name = 'app-examples'
  components = { TextColors, ListItems, ASTComponent }
  title = 'Examples'
  state = () => ({
    items: [],
    message: '',
    exampleComps: [
      {
        id: 1,
        title: 'Text Colors (1)',
        show: false,
        get template() {
          return <text-colors></text-colors>
        }
      },
      {
        id: 2,
        title: 'Text Colors (2)',
        show: false,
        get template() {
          return <text-colors></text-colors>
        }
      },
      {
        id: 3,
        title: 'List Items',
        show: false,
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
        id: 4,
        title: 'AST-based Component',
        show: false,
        get template() {
          return <ast-component></ast-component>
        }
      }
    ]
  })

  createdCallback() {
    this.addListItem('hello!')
  }

  get template() {
    return (
      <app-content title-text={this.title}>
        <span>{this.message}</span>
        {this.comps}
      </app-content>
    )
  }

  get comps() {
    return this.exampleComps.map(comp => {
      return (
        <div id="examples">
          <span
            class="link"
            onclick={() => this.toggleComp(comp)}>
            {comp.title}
          </span>
          <div class="comp">
            {comp.show === true ? comp.template : ''}
          </div>
        </div>
      )
    })
  }

  get styles() {
    return (`
        .link {
          color: var(--accent-color);
          cursor: pointer;
          margin-right: auto;
        }
        #examples h2 {
          display: inline-block;
          border-bottom: 1px solid #eee;
          padding-bottom: 3px;
          margin-bottom: 12px;
          letter-spacing: 0.03em;
        }
        .comp {
          border-left: 1px solid #eee;
          padding: 0 0 0 12px;
          margin-left: 12px;
        }
    `)
  }

  toggleComp(comp) {
    return comp.show = !comp.show
  }

  addListItem(text) {
    this.items.push(text)
  }

  removeItem(index) {
    this.items.splice(index, 1)
  }
}
