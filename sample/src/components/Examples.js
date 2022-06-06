const TextColors = () => import('@/components/TextColors')
const ListItems = () => import('@/components/ListItems')

export default class Examples {
  name = 'app-examples'
  components = { TextColors, ListItems }
  title = 'Examples'
  styles = (`
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

  state() {
    return {
      items: [],
      message: '',
      comps: [
          {
            title: 'Text Colors',
            show: false,
            template: `<text-colors></text-colors>`
          },
          {
            title: 'List Items',
            show: false,
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
          }
        ]
    }
  }

  createdCallback() {
    this.addListItem('hello!')
  }

  get template() {
    return `
      <content-element title-text="${this.title}">
        ${this.message}
        ${this.comps.map(comp => {
          return (`
            <div id="examples">
              <span class="link" onclick="toggleComp(${comp.title})">
                ${comp.title}
              </span>
              ${comp.show ? `<div class="comp">${comp.template}</div>` : ''}
            </div>
          `)
        }).join('')}
      </content-element>
    `
  }

  toggleComp(title) {
    const comp = this.comps.find(c => c.title === title)
    comp.show = !comp.show
  }

  addListItem(text) {
    this.items.push(text)
  }

  updateItems(e) {
    const index = e.detail
    this.items.splice(index, 1)
  }
}
