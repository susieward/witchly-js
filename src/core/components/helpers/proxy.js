
class Observer {
  constructor(obj, parent, callback, ref = null) {
    this._parent = parent
    this._callback = callback
    this._ref = ref
    this._obj = this.init(obj)
  }

  get parentEl() {
    return this.getParentEl()
  }

  init(obj) {
    const descObj = Object.getOwnPropertyDescriptors(obj)
    for (const key of Object.keys(descObj)) {
      const desc = descObj[key]
      let value = desc.value
      let obs = null

      if (value && typeof value === 'object') {
        if (!value.constructor.name.toLowerCase()?.includes('element')) {
          obs = new Observer(value, this, this._update, key)
          Object.defineProperty(obj, key, {
            value: obs._obj,
            enumerable: true,
            configurable: true
          })
        }
      } else if (desc.hasOwnProperty('get') && typeof desc.get !== 'undefined') {
        const getter = desc.get
        const vm = this.parentEl
        const value = getter.bind(vm)
        Object.defineProperty(obj, key, {
          get() {
            return value()
          },
          enumerable: true,
          configureable: true
        })
      }
    }
    const self = this
    return new Proxy(obj, {
      get(target, prop) {
        if (prop === 'toJSON') {
          return () => target
        }
        return target[prop]
      },
      set(target, prop, value) {
        const oldVal = target[prop]
        return self._handler(target, prop, value, oldVal)
      }
    })
  }

  _handler(target, prop, newVal, oldVal) {
    const vm = this.parentEl
    target[prop] = newVal
    this._callback.call(this._parent, prop, newVal, oldVal)
    if (vm.watch && vm.watch[prop]) {
      vm.watch[prop].handler.call(vm, newVal, oldVal)
    }
    return true
  }

  _update(prop, newVal, oldVal) {
    this._callback.call(this._parent, prop, newVal, oldVal)
  }

  getParentEl() {
    let el = null
    let parent = this._parent

    while (parent) {
      if (parent.constructor.name !== 'Observer') {
        el = parent
        break
      }
      parent = parent._parent
    }
    return el
  }
}

function observe(obj, vm, callback) {
  const obs = new Observer(obj, vm, callback)
  const proxy = obs._obj
  const descMap = Object.keys(obj).map(key => {
    return [`${key}`, {
      get() {
        return proxy[`${key}`]
      },
      set(val) {
        return proxy[`${key}`] = val
      },
      enumerable: true,
      configurable: true
    }]
  })
  Object.defineProperties(vm, Object.fromEntries(descMap))
}

module.exports = { observe }
