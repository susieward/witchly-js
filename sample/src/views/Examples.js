const TextColors = () => import('@/components/TextColors')
const ListItems = () => import('@/components/ListItems')

export default class Examples {
  name = 'examples-view'
  components = { TextColors, ListItems }
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
      }
    ]
  })

  createdCallback() {
    this.addListItem('hello!')
  }

  render() {
    return (
      <app-content title-text={this.title}>
        <span>{this.message}</span>
        <div id="examples">
          {this.comps}
        </div>
      </app-content>
    )
  }

  get comps() {
    return this.exampleComps.map(comp => {
      return (
        <div class="example">
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

  toggleComp(comp) {
    return comp.show = !comp.show
  }

  addListItem(text) {
    this.items.push(text)
  }

  removeItem(index) {
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
