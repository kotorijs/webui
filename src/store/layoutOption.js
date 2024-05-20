export default {
  namespaced: true,
  state: {
    token: '',
    isFoldAside: false
  },
  mutations: {
    updateToken(state, val = '') {
      state.token = val;
    },
    updateIsFoldAside(state, val = false) {
      state.isFoldAside = val;
    }
  },
  actions: {},
  getters: {}
};
