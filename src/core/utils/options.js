
function initOptions(obj, context, callback) {
  const descObj = buildDescriptorsObj(obj, context)

  for (const key of Object.keys(descObj)) {
    const desc = descObj[key]
    if (desc.hasOwnProperty('value') && typeof desc['value'] === 'function') {
      if (key === 'data') {
        const data = obj.data()
        observe(data, context, callback)
      } else {
        let val = obj[`${key}`]
        Object.defineProperty(context, key, {
          value: val.bind(context),
          enumerable: true
        })
      }
    } else {
      Object.defineProperty(context, key, desc)
    }
  }
  return context
}


function buildDescriptorsObj(obj, context) {
  let descObj = Object.getOwnPropertyDescriptors(obj)
  const dataset = Object.getOwnPropertyDescriptors(context.dataset)
  descObj = { ...descObj, ...dataset }
  if (obj.constructor.name !== 'Object') {
    descObj = {
      ...descObj,
      ...Object.getOwnPropertyDescriptors(obj.constructor.prototype)
    }
  }
  return descObj
}

function observe(obj, context, callback = null, handlerFn = handler) {
  if (!callback) callback = (...args) => args

  const proxy = new Proxy(obj, handlerFn(context, callback))
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
  Object.defineProperties(context, { ...Object.fromEntries(configs) })
  return proxy
}

function handler(context, callback, ref = null) {
  return {
    get(target, prop) {
      if (prop === 'toJSON') {
        return () => target
      }
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
          if (Array.isArray(context[ref]) && !Number.isNaN(prop)) {
            if (oldVal !== undefined) {
              target[prop] = value
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

function preprocess(options) {
  if (options.hasOwnProperty('default')) {
    options = options.default
  }
  if (options.constructor.name === 'Function') {
    options = (!options.prototype) ? options() : new options()
  }
  if (options.constructor.name === 'Promise') {
    return options.then(r => r.default)
  }
  return options
}

module.exports = { initOptions, observe, preprocess }
