
const Sidenav = (props, children) => {
  const navLinks = props.links.map(link => {
    return (
      <span class="link" onclick={() => props.onclick(link)}>
        {link.name}
      </span>
    )
  })

  return (
    <nav class="sidenav">
      <section class="container">
        {children}
        <div class="links-container">
          {navLinks}
        </div>
      </section>
    </nav>
  )
}

export default Sidenav
