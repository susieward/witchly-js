
const Sidenav = (props, children) => {
  const navLinks = props.links.map(link => {
    return (
      <span class="link" onclick={() => props.onclick(link)}>
        {link.name}
      </span>
    )
  })

  const styles = (`
    .link {
      color: var(--accent-color);
      cursor: pointer;
      margin-right: auto;
    }
    .sidenav {
      display: grid;
      align-content: flex-start;
      background-color: var(--content-bg-color);
      border: var(--content-border);
      border-radius: 5px;
      padding: 12px 20px;
      height: auto;
    }
    .sidenav h2 {
      display: inline-block;
      border-bottom: 1px solid #eee;
      padding-bottom: 3px;
      margin-bottom: 12px;
      letter-spacing: 0.03em;
    }
  `)

  return (
    <div>
      <aside class="sidenav">
        {navLinks}
        {children}
      </aside>
      <style>
        {styles}
      </style>
    </div>
  )
}

export default Sidenav
