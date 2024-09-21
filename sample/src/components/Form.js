
export default class Form {
  name = 'form-component'
  state = () => ({
    localFields: []
  })

  components = {
    TextField: () => import('@/components/TextField')
  }

  createdCallback() {
    if (this.fields?.length > 0) this.localFields = this.fields
  }

  render() {
    return (
      <div class="form">
        {this.localFields.map(row => this.buildRow(row))}
      </div>
    )
  }

  buildRow(fields) {
    return (
      <div class="row">
        {fields.map(field => {
          return (
            <text-field
              label={field.name} 
              value={field.value}
              type={field.type}
              onUpdate={(e) => this.updateField(field, e.detail)}>
              <small>{field.value}</small>
            </text-field>
          )
        })}
      </div>
    )
  }

  updateField(field, val) {
    field.value = val
  }

  get styles() {
    return (
      `.form {
        display: grid;
        border: 1px solid #eee;
        padding: 20px 22px;
        border-radius: 8px;
      }
      
      .row {
        display: grid;
        grid-auto-columns: 1fr;
        grid-auto-flow: column;
        grid-gap: 10px;
        padding: 8px 0px;
      }`
    )
  }
}