const TextColors = () => import('@/components/TextColors')
const ListItems = () => import('@/components/ListItems')
const ASTComponent = () => import ('@/components/ASTComponent')

export default class Examples {
  constructor() {
    this.el = 'app-examples'
    this.components = { TextColors, ListItems, ASTComponent }
    this.title = 'Examples'
    this.state = () => ({
      items: [],
      message: '',
      comps: [
        {
          id: 1,
          title: 'Text Colors (1)',
          show: false,
          template: `<text-colors></text-colors>`
        },
        {
          id: 2,
          title: 'Text Colors (2)',
          show: false,
          template: `<text-colors></text-colors>`
        },
        {
          id: 3,
          title: 'List Items',
          show: true,
          template: `
                <button onclick="addListItem('hello!')">
                  add item
                </button>
                <list-items
                  :value="message"
                  onremoved="updateItems"
                  items="${this.items}">
                </list-items>
              `
        },
        {
          id: 4,
          title: 'AST-based Component',
          show: false,
          template: `<ast-component></ast-component>`
        }
      ]
  })
  }

  createdCallback() {
    this.addListItem('hello!')
  }

  get template() {
    return (`
      <content-element title-text="${this.title}">
        <span>${this.message}</span>
        ${this.comps.map(comp => {
          return (`
            <div id="examples">
              <span class="link" onclick="toggleComp(${comp.id})">
                ${comp.title}
              </span>
              <div class="comp">
              ${comp.show === true ? comp.template : ''}
              </div>
            </div>
          `)
        }).join('')}
      </content-element>
    `)
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

  toggleComp(id) {
    const comp = this.comps.find(c => c.id == id)
    return comp.show = !comp.show
  }

  addListItem(text) {
    this.items.push(text)
  }

  updateItems(e) {
    const index = e.detail
    this.items.splice(index, 1)
  }
}
