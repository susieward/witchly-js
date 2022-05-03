
function initOptions(obj, context, callback) {
  if (typeof obj['data'] === 'function') {
    const data = obj.data()
    context.$data = observe(data, context, callback)
  }
  const methods = Object.keys(obj).filter(k => {
    return (k !== 'data') && (k !== 'template') && typeof obj[k] === 'function'
  })
  if (methods.length > 0) {
    const methodConfigs = methods.map(key => {
      return [`${key}`, {
        value: obj[`${key}`].bind(context),
        enumerable: true
      }]
    })
    Object.defineProperties(context, { ...Object.fromEntries(methodConfigs) })
  }
  if (obj.hasOwnProperty('template')) {
    Object.defineProperty(context, 'template', Object.getOwnPropertyDescriptor(obj, 'template'))
  }
  return context
}

function observe(obj, target, callback = null) {
  if (!callback) callback = (...args) => args
  const proxy = new Proxy(obj, handler(target, callback))
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
  Object.defineProperties(target, { ...Object.fromEntries(configs) })
  return proxy
}

function handler(context, callback, ref = null) {
  return {
    get(target, prop) {
			if (['[object Object]', '[object Array]'].indexOf(Object.prototype.toString.call(target[prop])) > -1) {
				return new Proxy(target[prop], handler(context, callback, prop))
			}
			return target[prop]
		},
    set(target, prop, value) {
      let newVal = value
      let oldVal = target[prop]
      if (ref) {
        if (prop !== 'length') {
          let key = null;
          if (Array.isArray(context[ref]) && !Number.isNaN(prop)) {
            if (oldVal !== undefined) {
              key = Number(prop)
              target[prop] = value;
              callback.apply(context, [ref, newVal, oldVal, context])
        			return true
            }
            newVal = target
            oldVal = context[ref]
            target[prop] = value;
            callback.apply(context, [ref, newVal, oldVal, context])
      			return true
          }
        }
        if (newVal < oldVal) {
          newVal = target
          oldVal = context[ref]
          target[prop] = value;
          callback.apply(context, [ref, newVal, oldVal, context])
          return true
        }
      }
      target[prop] = value
      if (typeof context[prop] !== "undefined") {
        callback.apply(context, [prop, newVal, oldVal, context])
      }
			return true
    }
  }
}

module.exports = { initOptions }
