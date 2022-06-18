
class Observer {
  constructor(obj, parent, callback, ref = null) {
    this._parent = parent
    this._callback = callback
    this._ref = ref
    this._obj = this.init(obj)
  }

  init(obj) {
    const descObj = Object.getOwnPropertyDescriptors(obj)
    for (const key of Object.keys(descObj)) {
      const desc = descObj[key]
      let value = desc.value
      let obs = null
      if (value && typeof value === 'object') {
        obs = new Observer(value, this, this._update, key)
        Object.defineProperty(obj, key, {
          value: obs._obj,
          enumerable: true,
          configurable: true
        })
      }
    }
    const self = this
    return new Proxy(obj, {
      get(target, prop) {
        return target[prop]
      },
      set(target, prop, value) {
        return self._handler(target, prop, value)
      }
    })
  }

  _handler(target, prop, value) {
    let newVal = value
    let oldVal = target[prop]

    if (this._ref) {
      if (this._parent['_obj']) {
        oldVal = this._parent._obj[this._ref]
        target[prop] = value
        newVal = target
        this._callback.call(this._parent, this._ref, newVal, oldVal)
        return true
      }
    }

    target[prop] = value
    this._callback.call(this._parent, prop, value, oldVal)
    return true
  }

  _update(prop, newVal, oldVal) {
    this._callback.call(this._parent, prop, newVal, oldVal)
  }
}

function observe(obj, context, callback = null) {
  if (!callback) callback = (...args) => args

  const obs = new Observer(obj, context, callback)
  const proxy = obs._obj
  const configs = Object.keys(obj).map(key => {
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
  const desc = Object.fromEntries(configs)
  Object.defineProperties(context, desc)
  return proxy
}

module.exports = { observe }
