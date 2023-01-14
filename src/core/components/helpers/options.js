const { observe } = require('./proxy')
const { initStyles } = require('./styles')
const staticProps = ['name', 'components', 'constructor']

async function initOptions(vm, callback, doc) {
  const options = vm._options
  const descriptors = _buildDescriptorsObject(options)
  const watchedProps = options.watch ? Object.keys(options.watch) : []

  for (const key of Object.keys(descriptors)) {
    const desc = descriptors[key]
    if (['template', 'render'].includes(key)) {
      _defineTemplate(desc, vm)
    } else if ([...watchedProps, 'state', 'attrs', 'styles'].includes(key)) {
      continue
    } else if (staticProps.includes(key)) {
      _defineStaticProp(key, desc, vm)
    } else if (desc.hasOwnProperty('value') && typeof desc.value === 'function') {
      _defineMethod(key, desc, vm)
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
  const styleSheets = await initStyles(vm, vm.styles, doc)
  if (styleSheets.length > 0) {
    vm._constructedStyles = styleSheets
    vm.shadowRoot.adoptedStyleSheets = vm._constructedStyles
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
  const result = desc.value.call(vm)
  if (result?.constructor?.name !== 'Object') {
    throw new Error('State must return an object')
  }
  observe(result, vm, callback)
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

function _defineMethod(key, desc, vm) {
  const boundFn = desc.value.bind(vm)
  Object.defineProperty(vm, key, {
    value: boundFn,
    enumerable: true
  })
}

module.exports = { initOptions }
