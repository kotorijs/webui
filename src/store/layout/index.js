export default {
  namespaced: true,
  state: {
    token: '',
    isFoldAside: false,
    host: '',
    port: '',
    wsHost: '',
    username: '',
    password: ''
  },
  mutations: {
    updateToken(state, val = '') {
      state.token = val;
    },
    updateIsFoldAside(state, val = false) {
      state.isFoldAside = val;
    },
    updateHost(state, val = '') {
      state.host = val;
    },
    updatePort(state, val = '') {
      state.port = val;
    },
    updateWsHost(state, val = '') {
      state.wsHost = val;
    },
    updateUsername(state, val = '') {
      state.username = val;
    },
    updatePassword(state, val = '') {
      state.password = val;
    }
  },
  actions: {},
  getters: {
    getIsFoldAside(state) {
      return state.isFoldAside;
    }
  }
};
