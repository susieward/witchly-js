const { createComponent } = require('../components')

class RouterView extends HTMLElement {
  #components = {}
  #route = null
  #instance = null

  constructor() {
    super()
    window.onpopstate = async () => {
      const routeRecord = this.#buildRouteRecord(this.location.pathname)
      this.#route = routeRecord
      await this.#render()
    }
    this.attachShadow({ mode: 'open' })
    this.#route = this.#buildRouteRecord(this.location.pathname, false)
  }

  get _route() {
    return this.#route
  }

  get history() {
    return window.history
  }

  get location() {
    return window.location
  }

  get currentRoute() {
    return _match(this._path, this.routes)
  }

  get _currentComponent() {
    return this.#components[this.currentRoute?.component?.name]
  }

  get _basePath() {
    return `${this.location.protocol}//${this.location.host}`
  }

  get _path() {
    return this.location.pathname
  }

  connectedCallback() {
    this.#render().catch(err => console.error(err))
  }

  async #render() {
    if (!this._currentComponent) {
      const comp = await createComponent(this.currentRoute.component, this._root)
      this.#components[this.currentRoute.component.name] = comp
    }

    const el = new this._currentComponent._ctor()
    if (!el._props) el._props = {}
    el._props = { ...el._props, ...this._route.params }

    if (!this.shadowRoot.firstChild) {
      this.shadowRoot.append(el)
    } else {
      this.shadowRoot.firstChild.replaceWith(el)
    }
    this.#instance = el
  }

  async push(data) {
    const routeRecord = this.#buildRouteRecord(data)
    this.#route = routeRecord
    this.history.pushState(routeRecord, null, routeRecord.fullPath)
    await this.#render().catch(err => console.error(err))
    /*
    if (routeRecord.name === routeRecord.prev?.name) {
      const keys = Object.keys(this.#route.params)
      if (keys?.length > 0) {
        for (const key of keys) {
          this.#instance.$props[key] = this.#route.params[key]
        }
      }
      //this.#instance.$props = { ...this.#route.params }
      // console.log('this.#route.params', this.#route.params)
      return
    } else {
      await this.#render()
    }
    */
  }

  #buildRouteRecord(data, prev = true) {
    const match = _match(data, this.routes)
    if (!match) {
      throw new Error(`Router: Path for route record could not be found`)
    }
    let resolved = _resolvePath(data, match.path)
    let params = data?.params || {}

    if (typeof data === 'string' && data !== resolved) {
      params = _resolvePathParams(resolved, data)
      resolved = _resolvePath({ params }, match.path)
    }
    const routeRecord = {
      prev: {},
      name: match.name,
      path: match.path,
      fullPath: `${this._basePath}${resolved}`,
      component: match.component.name,
      params,
      query: data?.query || {}
    }
    if (prev) {
      const { name, path, component } = this.currentRoute
      routeRecord.prev = {
        name,
        path,
        component: component?.name,
        fullPath: `${this._basePath}${path}`
      }
    }
    return routeRecord
  }
}

function _resolvePath(data, path) {
  let newPath = path.slice()
  if (path.includes('/:')) {
    const index = path.indexOf('/:')
    const key = path.substring(index + 2)
    if (data.params && data.params[key]) {
      const value = data.params[key]
      newPath = path.replace(`:${key}`, `${value.toString()}`)
    }
  }
  return newPath
}

function _resolvePathParams(routePath, path) {
  const arr = routePath.split('/').filter(Boolean)
  const arr2 = path.split('/').filter(Boolean)
  const params = {}
  for (const [index, val] of arr.entries()) {
    const val2 = arr2[index]
    if (val.includes(':')) {
      const key = val.substring(1)
      params[key] = val2
    }
  }
  return params
}

function _match(data, routes) {
  if (typeof data === 'string') {
    return matchPathString(data, routes)
  }
  let key = 'path'
  let value = ''
  if (typeof data === 'string' && (data.startsWith('/'))) {
    value = data
  } else if (data && typeof data === 'object') {
    if (!data.path && data.name) {
      key = 'name'
      value = data.name
    } else {
      value = data?.path
    }
  }
  return routes.find(r => r[key] === value)
}

function matchPathString(path, routes) {
  const match = routes.find(route => {
    const normalized = normalizePathString(route.path)
    return path === '/'
      ? route.path === path
      : (normalized !== '/') && path.includes(normalized)
  })
  return match
}

function normalizePathString(path) {
  let normalized = path
  if (path.includes('/:')) {
    const index = path.indexOf('/:')
    const key = path.substring(index + 2)
    normalized = path.replace(`/:${key}`, '')
  }
  return normalized
}

module.exports = RouterView