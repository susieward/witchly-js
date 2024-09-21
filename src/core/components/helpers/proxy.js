
class Observer {
  constructor({ obj, parent, callback, ref = null }) {
    this._parent = parent
    this._callback = callback
    this._ref = ref
    this._obj = this.init(obj)
  }

  get refTarget() {
    return this._ref && this._parent._obj ? this._parent._obj[this._ref] : null
  }

  get parentEl() {
    return this.getParentEl()
  }

  init(obj) {
    const observedObj = _buildObservedObj(this, obj)
    const self = this
    return new Proxy(observedObj, {
      get(target, prop) {
        if (prop === 'toJSON') {
          return () => target
        }
        return target[prop]
      },
      async set(target, prop, value) {
        const oldVal = target[prop]
        return await self._handler(target, prop, value, oldVal).catch(err => console.error(err))
      }
    })
  }

  async _handler(target, prop, newVal, oldVal) {
    if (_shouldObserve(newVal)) {
      const obs = new Observer({ obj: newVal, parent: this, callback: this._update, ref: prop })
      newVal = obs._obj
    }
    if (this._ref) {
      let oldValue = null
      let oldValueStr = ''
      const refValue = this.refTarget
      if (refValue) {
        oldValue = JSON.parse(JSON.stringify(refValue))
        oldValueStr = JSON.stringify(oldValue)
      }
      target[prop] = newVal
      const newValueStr = JSON.stringify(refValue)
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
    || value instanceof Node
}

function _isProxy(value) {
  try {
    structuredClone(value)
  } catch (err) {
    return err && err.code === 25
  }
  return false
}

function _buildObservedObj(obs, obj) {
  const vm = obs.parentEl
  const descObj = Object.getOwnPropertyDescriptors(obj)

  for (const key of Object.keys(descObj)) {
    const desc = descObj[key]
    let value = desc.value
    if (_shouldObserve(value)) {
      const _obs = new Observer({
        obj: value, 
        parent: obs, 
        callback: obs._update, 
        ref: key
      })
      Object.defineProperty(obj, key, {
        value: _obs._obj,
        enumerable: true,
        configurable: true,
        writable: true
      })
    } else if (desc.get) {
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
  const obs = new Observer({ obj, parent: vm, callback })
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

export { observe }
