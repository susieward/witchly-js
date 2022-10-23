export const Subheader = () => {
  return {
    name: 'app-subheader',
    render() {
      return (
        <h3 class="section-subheader">
          <slot></slot>
        </h3>
      )
    }
  }
}

export const Section = () => {
  return {
    name: 'app-section',
    props: ['header'],
    render() {
      return (
        <div class="section-container">
          <h2 class="section-title">{this.header}</h2>
          <div class="section">
            <slot></slot>
          </div>
        </div>
      )
    }
  }
}
