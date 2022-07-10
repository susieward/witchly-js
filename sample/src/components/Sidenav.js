
const Sidenav = (props, children) => {
  const navLinks = props.links.map(link => {
    return (
      <span class="link" onclick={() => props.vm.$go(link.path)}>
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
