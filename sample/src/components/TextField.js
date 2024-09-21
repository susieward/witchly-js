
export default class TextField {
  name = 'text-field'
  state = () => ({
    localValue: '',
    isFocused: false
  })

  watch = {
    localValue: {
      handler(newVal) {
        console.log(newVal)
        this.$emit('update', newVal)
      }
    }
  }

  createdCallback() {
    if (this.value) this.localValue = this.value
  }

  render() {
    return (
      <fieldset class="text-field">
        {(this.isFocused || this.localValue) && <legend>{this.label}</legend>}
        <input
          value={this.localValue}
          placeholder={(!this.localValue && !this.isFocused) ? this.label : ''}
          onfocus={() => this.isFocused = true}
          onblur={() => this.isFocused = false}
          oninput={(e) => this.localValue = e.target.value}
          type={this.type || 'text'} />
        <slot></slot>
      </fieldset>
    )
  }

  get styles() {
    return (
      `fieldset {
        background-color: transparent;
        border: none;
        padding: 0;
        width: 100%;
        margin: 0;
        display: block;
        min-inline-size: none;
        position: relative;
      }
      
      .text-field legend {
        border: none;
        line-height: normal;
        padding: 0px 4px;
        margin-left: 7px;
        background-color: #fff;
        font-size: 0.85rem;
        color: #777;
        position: absolute;
        margin-top: -8px;
      }
      
      .text-field input {
        background-color: #fff;
        border: var(--content-border);
        border-radius: 5px;
        color: var(--text-color);
        font-family: var(--font-family);
        font-size: 16px;
        min-height: 36px;
        line-height: normal;
        padding: 10px 12px;
        margin: 0;
        min-width: auto;
        width: 100%;
      }`
    )
  }
}