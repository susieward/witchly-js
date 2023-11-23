const toKebabCase = (str) => str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()
const mapKeys = (obj) => Object.keys(obj).map(k => `${toKebabCase(k)}: ${obj[k]};`)

function _resolve(value) {
  if (value?.default) {
    value = value.default
  }
  if (_isFn(value)) {
    value = (!value.prototype) ? value() : new value()
    if (_isFn(value)) {
      return _resolve(value?.default || value)
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
