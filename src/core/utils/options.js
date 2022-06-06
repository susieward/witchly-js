const { watch } = require('./proxy')

function initOptions(options, vm, callback) {
  const staticProps = ['name', 'components', 'constructor']
  let descriptors = Object.getOwnPropertyDescriptors(options)

  if (options.constructor.name !== 'Object') {
    const prototypeDesc = Object.getOwnPropertyDescriptors(options.constructor.prototype)
    descriptors = { ...descriptors, ...prototypeDesc }
  }

  for (const key of Object.keys(descriptors)) {
    const desc = descriptors[key]
    if (key === 'state') {
      continue
    } else if (staticProps.includes(key)) {
      _initStaticProp(key, desc, vm)
    } else if (desc.hasOwnProperty('value') && typeof desc.value === 'function') {
      _initMethod(key, desc, vm)
    } else {
      Object.defineProperty(vm, key, desc)
    }
  }

  const attrs = vm.attributes
  if (attrs && Object.keys(attrs)?.length > 0) {
    _initAttributes(vm, attrs)
  }

  if (descriptors.state) {
    const key = 'state'
    const desc = descriptors[key]
    _initState(key, desc, vm, callback)
  }

  return vm
}

function _initStaticProp(key, desc, vm) {
  Object.defineProperty(vm, key, {
    ...desc,
    enumerable: true,
    writeable: false
  })
}

function _initMethod(key, desc, vm) {
  const boundFn = desc.value.bind(vm)
  Object.defineProperty(vm, key, {
    value: boundFn,
    enumerable: true
  })
}

function _initState(key, desc, vm, callback) {
  if (typeof desc.value !== 'function') {
    throw new Error('State must be a function')
  }
  const result = desc.value.call(vm)
  if (!result || typeof result !== 'object') {
    throw new Error('State must return an object')
  }
  watch(result, vm, callback)
}

function _initAttributes(vm, attrs) {
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

module.exports = { initOptions }
