
export default {
  name: 'about-view',
  title: 'about',
  get template() {
    return `
      <content-element title-text="${this.title}">
        <div>
        <p>
          <code>
            Something will go here!
          </code>
          </p>
        <button onclick="$go('/')">home</button>
        </div>
      </content-element>
    `
  }
}
