const AttrHandler = require('./attr-handler')

class MapItems extends AttrHandler {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = '<slot></slot>'
  }

  static define() {
    if (!customElements.get('map-items')) {
      customElements.define('map-items', this)
    }
  }

  static get observedAttributes() {
    return ['items']
  }

  get parentComponent() {
    return this.parentElement?.getRootNode()?.host
  }

  async connectedCallback() {
    await this.displayItems().catch(err => console.error(err))
  }

  async attributeChangedCallback(prop, oldVal, newVal) {
    if (prop === 'items' && this.isConnected) {
      await this.displayItems().catch(err => console.error(err))
    }
  }

  async displayItems() {
    const items = this.getAttribute('items')
    if (Array.isArray(items) && items.length > 0) {
      const promises = items.map((item, i) => {
        return Promise.resolve(this._props['data-for'].apply(this.parentComponent, [item, i]))
      })
      const results = await Promise.all(promises)
      this.replaceChildren(...results)
    }
  }
}

module.exports = MapItems
