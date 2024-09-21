const toKebabCase = (str) => str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()

function _resolve(value) {
  if (value?.default) {
    value = value.default
  }
  if (value instanceof Function) {
    value = (!value.prototype) ? value() : new value()
    return _resolve(value?.default || value)
  }
  if (value instanceof Promise) {
    return Promise.resolve(value.then(v => _resolve(v?.default || v)))
  }
  return value
}

export { _resolve, toKebabCase }
