const { observe } = require('./proxy')

function initOptions(options, vm, callback) {
  const staticProps = ['name', 'components', 'constructor']
  const descriptors = _buildDescriptorsObject(options)
  const watchedProps = options.watch ? Object.keys(options.watch) : []

  for (const key of Object.keys(descriptors)) {
    const desc = descriptors[key]
    if (key === 'state' || watchedProps.includes(key)) {
      continue
    } else if (key === 'template') {
      _defineTemplate(desc, vm)
    } else if (staticProps.includes(key)) {
      _defineStaticProp(key, desc, vm)
    } else if (desc.hasOwnProperty('value') && typeof desc.value === 'function') {
      _defineMethod(key, desc, vm)
    } else {
      Object.defineProperty(vm, key, desc)
    }
  }

  _defineAttrs(vm, options)
  if (descriptors.state) {
    _defineState(descriptors.state, vm, callback)
  }
  if (watchedProps.length > 0) {
    _defineWatchers(watchedProps, descriptors, vm)
  }
  return vm
}

function _buildDescriptorsObject(options) {
  let descriptors = Object.getOwnPropertyDescriptors(options)
  if (options.constructor.name !== 'Object') {
    const prototypeDesc = Object.getOwnPropertyDescriptors(options.constructor.prototype)
    descriptors = { ...descriptors, ...prototypeDesc }
  }
  return descriptors
}

function _defineTemplate(desc, vm) {
  let val
  let getter = null
  if (desc.hasOwnProperty('value') && typeof desc.value === 'function') {
    val = desc.value
  } else if (desc.hasOwnProperty('get')) {
    getter = desc.get
  } else {
    throw new Error('Template must be a getter or a function')
  }
  Object.defineProperty(vm, 'template', {
    get() {
      return getter ? getter.call(vm) : val.call(vm, vm)
    },
    enumerable: true,
    configureable: true
  })
}

function _defineState(desc, vm, callback) {
  if (typeof desc.value !== 'function') {
    throw new Error('State must be a function')
  }
  const result = desc.value.call(vm)
  if (!result || typeof result !== 'object') {
    throw new Error('State must return an object')
  }
  observe(result, vm, callback)
}

function _defineWatchers(watchedProps, descriptors, vm) {
  // TO DO: be able to watch a prop defined on the state object
  for (const prop of watchedProps) {
    const desc = descriptors[prop]
    Object.defineProperty(vm, prop, {
      get() {
        return desc.get?.call(vm) || desc.value
      },
      set(val) {
        if (desc.set) {
          desc.set.call(vm, val)
          vm.watch[prop].handler.call(vm, val)
          return true
        } else {
          desc.value = val
          vm.watch[prop].handler.call(vm, val)
          return true
        }
      },
      enumerable: true,
      configureable: true
    })
  }
}

function _defineAttrs(vm, options) {
  Object.defineProperty(vm, '$attrs', {
    get() {
      return vm.attributes
    },
    enumerable: true,
    writeable: false
  })
  const observedAttrs = options.observedAttributes || vm.constructor?.observedAttributes
  if (observedAttrs?.length > 0) {
    for (const attr of observedAttrs) {
      Object.defineProperty(vm, attr, {
        get() {
          return vm.getAttribute(attr)
        },
        set(newVal) {
          return vm.setAttribute(attr, newVal)
        },
        enumerable: true,
        configureable: true
      })
    }
  }
}

function _buildAttrsObj(vm) {
  const attrs = vm.getAttributeNames()
  const attrsObj = {}

  if (attrs.length > 0) {
    for (const attr of attrs) {
      Object.defineProperty(attrsObj, attr, {
        get() {
          return vm.getAttribute(attr)
        },
        set(newVal) {
          return vm.setAttribute(attr, newVal)
        },
        enumerable: true,
        configureable: true
      })
    }
  }
  return attrsObj
}

function _defineStaticProp(key, desc, vm) {
  Object.defineProperty(vm, key, {
    ...desc,
    enumerable: true,
    writeable: false,
    configureable: false
  })
}

function _defineMethod(key, desc, vm) {
  const boundFn = desc.value.bind(vm)
  Object.defineProperty(vm, key, {
    value: boundFn,
    enumerable: true
  })
}

module.exports = { initOptions }
