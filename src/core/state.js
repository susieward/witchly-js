
class AppState {
  constructor(state = {}) {
    this.state = state
    return new Proxy(this, {
      get(target, prop) {
        return target.state[prop]
      },
      set(target, prop, value) {
        return target.state[prop] = value
      }
    })
  }
}

class StateManager {
  #state
  #mutations
  #actions

  constructor(options) {
    this.#state = new AppState(options?.state || {})
    this.#mutations = options?.mutations || {}
    this.#actions = options?.actions || {}
  }

  get state() {
    return this.#state
  }

  get mutations() {
    return this.#mutations
  }

  get actions() {
    return this.#actions
  }

  commit(mutation, ...args) {
    if (typeof mutation !== 'string') {
      throw new Error(`Mutation reference must be a string, got ${typeof mutation}`)
    } else if (!this.mutations[mutation]) {
      throw new Error(`Mutation ${mutation} is not defined`)
    }
    return this.mutations[mutation].apply(this, [this.state, ...args])
  }

  async dispatch(action, ...args) {
    if (typeof action !== 'string') {
      throw new Error(`Action reference must be a string, got ${typeof action}`)
    } else if (!this.actions[action]) {
      throw new Error(`Action ${action} is not defined`)
    }
    return this.actions[action].apply(this, [this, ...args])
  }
}

export default StateManager
