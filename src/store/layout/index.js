export default {
  namespaced: true,
  state: {
    token: '',
    isFoldAside: false,
    isNarrowScreen: false,
    host: '',
    port: '',
    sandBoxPort: 720,
    protocol: '',
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
    updateIsNarrowScreen(state, val = false) {
      state.isNarrowScreen = val;
    },
    updateHost(state, val = '') {
      state.host = val;
    },
    updatePort(state, val = '') {
      state.port = val;
    },
    updateSandBoxPort(state, val = 720) {
      state.sandBoxPort = val;
    },
    updateProtocol(state, val = '') {
      state.protocol = val;
      console.log('new protocol', val);
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
    },
    getIsNarrowScreen(state) {
      return state.isNarrowScreen;
    }
  }
};
