
function watch(obj, context, callback = null) {
  if (!callback) callback = (...args) => args

  const proxy = new Proxy(obj, handler(context, callback))
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

function handler(context, callback, ref = null) {
  return {
    get(target, prop, receiver) {
      if (prop === 'toJSON') {
        return () => target
      }
      if (['[object Object]', '[object Array]']
        .indexOf(Object.prototype.toString.call(target[prop])) > -1) {
          return new Proxy(target[prop], handler(context, callback, prop))
      }
      return target[prop]
		},
    set(target, prop, value, receiver) {
      if (ref) {
        return setObjectOrArray(target, prop, value, context, ref, callback)
      }
      let newVal = value
      let oldVal = target[prop]
      target[prop] = value
      if (typeof context[prop] !== "undefined") {
        callback.apply(context, [prop, newVal, oldVal, context])
      }
      return true
    },

  }
}

function setObjectOrArray(target, prop, value, context, ref, callback) {
  let newVal = value
  let oldVal = target[prop]
  if (prop !== 'length') {
    if (Array.isArray(context[ref]) && !Number.isNaN(prop)) {
      if (oldVal !== undefined) {
        target[prop] = value
        callback.apply(context, [ref, newVal, oldVal, context])
        return true
      }
      newVal = target
      oldVal = context[ref]
      target[prop] = value
      callback.apply(context, [ref, newVal, oldVal, context])
      return true
    }
  }
  if (newVal < oldVal) {
    newVal = target
    oldVal = context[ref]
    target[prop] = value
    callback.apply(context, [ref, newVal, oldVal, context])
    return true
  }

  target[prop] = value
  if (typeof context[prop] !== "undefined") {
    callback.apply(context, [prop, newVal, oldVal, context])
  }
  return true
}

module.exports = { watch }
