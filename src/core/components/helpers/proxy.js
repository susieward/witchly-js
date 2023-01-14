
class Observer {
  constructor(obj, parent, callback, ref = null) {
    this._parent = parent
    this._callback = callback
    this._ref = ref
    this._obj = this.init(obj)
  }

  get refTarget() {
    return this._ref ? this._parent._obj[this._ref] : null
  }

  get parentEl() {
    return this.getParentEl()
  }

  init(obj) {
    obj = _buildObserverObj(this, obj)
    const self = this
    return new Proxy(obj, {
      get(target, prop, receiver) {
        if (prop === 'toJSON') {
          return () => target
        }
        return target[prop]
      },
      async set(target, prop, value, receiver) {
        const oldVal = target[prop]
        return await self._handler(target, prop, value, oldVal, receiver).catch(err => console.error(err))
      }
    })
  }

  async _handler(target, prop, newVal, oldVal, receiver) {
    if (_shouldObserve(newVal)) {
      const obs = new Observer(newVal, this, this._update, prop)
      newVal = obs._obj
    }
    if (this._ref) {
      let oldValue = null
      let oldValueStr = ''
      const targetValue = this.refTarget
      if (targetValue) {
        oldValue = JSON.parse(JSON.stringify(targetValue))
        oldValueStr = JSON.stringify(oldValue)
      }
      target[prop] = newVal
      const newValueStr = JSON.stringify(targetValue)
      const sameVal = (newValueStr === oldValueStr)
      if (!sameVal) {
        await this._callback.call(this._parent, this._ref, JSON.parse(newValueStr), oldValue)
      }
      return true
    }
    target[prop] = newVal
    await this._callback.call(this._parent, prop, newVal, oldVal)
    return true
  }

  _update(prop, newVal, oldVal) {
    if (newVal === oldVal) return
    return this._callback.call(this._parent, prop, newVal, oldVal)
  }

  getParentEl() {
    if (this._parent.constructor.name !== 'Observer') {
      return this._parent
    }
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

function _shouldObserve(value) {
  return (['Object', 'Array'].includes(value?.constructor?.name))
}

function _buildObserverObj(_obs, obj) {
  const vm = _obs.parentEl
  const descObj = Object.getOwnPropertyDescriptors(obj)

  for (const key of Object.keys(descObj)) {
    const desc = descObj[key]
    let value = desc.value
    let obs = null
    if (value && typeof value === 'object') {
      if (!value.constructor.name.toLowerCase()?.includes('element')) {
        obs = new Observer(value, _obs, _obs._update, key)
        Object.defineProperty(obj, key, {
          value: obs._obj,
          enumerable: true,
          configurable: true,
          writable: true
        })
      }
    } else if (desc.hasOwnProperty('get') && typeof desc.get !== 'undefined') {
      const getter = desc.get
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
  return obj
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
