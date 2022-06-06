
const Nav = (links) => {
  const name = 'app-sidenav'

  const createLinks = () => {
    return links.map(link => {
      return `<span class="link" onclick="$go(${link.path})">${link.name}</span>`
    }).join('')
  }

  const styles = (`
    .link {
      color: var(--accent-color);
      cursor: pointer;
      margin-right: auto;
    }
    .sidenav h2 {
      display: inline-block;
      border-bottom: 1px solid #eee;
      padding-bottom: 3px;
      margin-bottom: 12px;
      letter-spacing: 0.03em;
    }
  `)

  const template = (`
    <aside class="sidenav">
      ${createLinks()}
    </aside>
  `)

  return { name, styles, template }
}

export default Nav
