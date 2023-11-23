
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
      color: var(--text-color-light);
      cursor: pointer;
      margin-right: auto;
    }
    .sidenav {
      display: grid;
      align-content: flex-start;
      max-height: 100%;
      padding: 15px 30px;
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
    <aside class="sidenav">
      {navLinks}
      {children}
      <style>{styles}</style>
    </aside>
  )
}

export default Sidenav
