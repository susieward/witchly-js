const CodeEditor =  () => import('@/components/CodeEditor')
const Form = () => import('@/components/Form')

export default class Home {
  name = 'home-view'
  title = 'Home'
  components = { CodeEditor, Form }
  state = () => ({ 
    paramsMessage: '',
    fields: [
      [
        { name: 'First Name', value: 'Piper', type: 'text' }, 
        { name: 'Last Name', value: '', type: 'text' }
      ],
      [
        { name: 'City', value: '', type: 'text' },
        { name: 'State', value: '', type: 'text' },
        { name: 'Zip', value: '', type: 'number' }
      ]
    ]
  })

  connectedCallback() {
    this.$root.addEventListener('hi', this.hi)
  }

  disconnectedCallback() {
    this.$root.removeEventListener('hi', this.hi)
  }

  get id() {
    return this.$route.params.id
  }

  render() {
    return (
      <app-content title-text={this.title}>
        <div class="container">
          <form-component fields={this.fields} />
        </div>
      </app-content>
    )
  }

  navigate() {
    this.$router.push({
      path: '/examples',
      params: { message: this.paramsMessage }
    })
  }

  hi(e) {
    return this.$root.shadowRoot.firstElementChild.append(e.detail)
  }

  get styles() {
    return (
      `
      .container {
        display: grid;
        grid-row-gap: 18px;
      }`
    )
  }
}
