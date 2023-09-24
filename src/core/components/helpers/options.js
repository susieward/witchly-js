import { observe } from './proxy'
const staticProps = ['name', 'components']

function initOptions(vm, callback) {
  const options = vm._options
  const descriptors = _buildDescriptorsObject(options)
  const watchedProps = options.watch ? Object.keys(options.watch) : []

  for (const key of Object.keys(descriptors)) {
    const desc = descriptors[key]
    if (['template', 'render'].includes(key)) {
      _defineTemplate(desc, vm)
    } else if (key === 'methods') {
      _defineMethods(desc, vm)
    } else if ([...watchedProps, 'state', 'attrs', 'styles', 'constructor'].includes(key)) {
      continue
    } else if (staticProps.includes(key)) {
      _defineStaticProp(key, desc, vm)
    } else if (desc.hasOwnProperty('value') && typeof desc.value === 'function') {
      _defineMethod(key, desc.value, vm)
    } else {
      Object.defineProperty(vm, key, desc)
    }
  }

  if (vm.hasAttributes()) {
    _defineAttrs(vm, options)
  }
  if (descriptors.state) {
    _defineState(descriptors.state, vm, callback)
  }
  if (watchedProps.length > 0) {
    _defineWatchers(watchedProps, descriptors, vm)
  }
  if (descriptors.styles) {
    _defineProp(descriptors.styles, vm, 'styles')
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
    throw new Error('Template/render must be a getter or a function')
  }
  Object.defineProperty(vm, 'template', {
    get() {
      return getter?.call(vm) || val.call(vm, vm)
    },
    enumerable: true,
    configureable: true
  })
}

function _defineState(desc, vm, callback) {
  if (typeof desc.value !== 'function') {
    throw new Error('State must be a function')
  }
  const obj = desc.value.call(vm)
  if (obj?.constructor?.name !== 'Object') {
    throw new Error('State function must return an object')
  }
  observe(obj, vm, callback)
}

function _defineProp(desc, vm, prop) {
  let val
  let getter = null
  if (desc.hasOwnProperty('value') && typeof desc.value === 'function') {
    val = desc.value
  } else if (desc.hasOwnProperty('get')) {
    getter = desc.get
  }
  Object.defineProperty(vm, prop, {
    get() {
      return getter?.call(vm) || val.call(vm, vm)
    },
    enumerable: true,
    configureable: true
  })
}

function _defineWatchers(watchedProps, descriptors, vm) {
  for (const prop of watchedProps) {
    if (vm.hasOwnProperty(prop)) {
      continue
    }
    const desc = descriptors[prop]
    Object.defineProperty(vm, prop, {
      get() {
        return desc.get?.call(vm) || desc.value
      },
      set(val) {
        const oldVal = desc.value
        if (desc.set) {
          desc.set.call(vm, val)
          vm.watch[prop].handler.call(vm, val, oldVal)
          return true
        } else {
          desc.value = val
          vm.watch[prop].handler.call(vm, val, oldVal)
          return true
        }
      },
      enumerable: true,
      configureable: true
    })
  }
}

function _defineAttrs(vm, options) {
  const attrs = vm.getAttributeNames()
  const observedAttrs = options.observedAttributes
    || vm.constructor?.observedAttributes
    || []
  const uniqueAttrs = Array.from(new Set([...attrs, ...observedAttrs]))

  for (const attr of uniqueAttrs) {
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

function _defineStaticProp(key, desc, vm) {
  Object.defineProperty(vm, key, {
    ...desc,
    enumerable: true,
    writeable: false,
    configureable: false
  })
}

function _defineMethods(desc, vm) {
  if (desc?.value?.constructor?.name !== 'Object') {
    throw new Error('Methods option must be an object')
  }
  const entries = Object.entries(desc.value)
  for (const [key, val] of entries) {
    Object.defineProperty(vm, key, {
      value: function(...args) {
        return val.apply(vm, [...args])
      },
      enumerable: true
    })
  }
}

function _defineMethod(key, value, vm) {
  const boundFn = value.bind(vm)
  Object.defineProperty(vm, key, {
    value: boundFn,
    enumerable: true
  })
}

export { initOptions }
