const toKebabCase = (str) => str.replace(/[A-Z]/g, "-$&").toLowerCase()
const mapKeys = (obj) => Object.keys(obj).map(k => `${toKebabCase(k)}: ${obj[k]};`)

function _resolve(value) {
  if (value?.hasOwnProperty('default')) {
    value = value.default
  }
  if (_isFn(value)) {
    value = (!value.prototype) ? value() : new value()
    if (_isFn(value)) {
      return _resolve(value)
    }
  }
  if (value?.constructor?.name === 'Promise') {
    return value.then(v => _resolve(v?.default || v))
  }
  return value
}

function _isFn(value) {
  return ['Function', 'AsyncFunction'].includes(value?.constructor?.name)
}

function _isElement(val) {
  return val?.childNodes?.constructor?.name === 'NodeList'
}

export { _resolve, toKebabCase, mapKeys, _isElement }
