const { observe } = require('./proxy')

function initOptions(options, vm, callback) {
  const staticProps = ['el', 'components', 'constructor']
  const descriptors = _buildDescriptorsObject(options)

  for (const key of Object.keys(descriptors)) {
    const desc = descriptors[key]
    if (key === 'state') {
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

  const attrs = vm.attributes
  if (attrs && Object.keys(attrs)?.length > 0) {
    _defineAttributes(vm, attrs)
  }
  if (descriptors.state) _defineState(descriptors.state, vm, callback)
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
  let val = ''
  let getter = null
  if (desc.hasOwnProperty('value')) {
    val = (typeof desc.value === 'function')
      ? desc.value.call(vm, vm)
      : desc.value
  } else if (desc.hasOwnProperty('get')) {
    getter = desc.get
  }
  Object.defineProperty(vm, 'template', {
    get() {
      return getter ? getter.call(vm) : val
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

function _defineAttributes(vm, attrs) {
  const attrsMap = Object.getOwnPropertyDescriptors(attrs)
  for (const key of Object.keys(attrsMap)) {
    const num = Number(key)
    if (Number.isNaN(num)) {
      const desc = attrsMap[key]
      Object.defineProperty(vm, key, {
        get() {
          return attrs[key].value
        },
        enumerable: true
      })
    }
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

function _defineMethod(key, desc, vm) {
  const boundFn = desc.value.bind(vm)
  Object.defineProperty(vm, key, {
    value: boundFn,
    enumerable: true
  })
}

module.exports = { initOptions }
