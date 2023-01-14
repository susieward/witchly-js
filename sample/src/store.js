
export default {
  state: {
    message: ''
  },
  mutations: {
    setMessage(state, value) {
      state.message = value
    }
  },
  actions: {
    updateMessage(context, value) {
      context.commit('setMessage', value)
    }
  }
}
