import Vue from 'vue';
import Vuex from 'vuex';
import webSocketOption from './webSocket';
import layoutOption from './layout';
import modulesDetail from './modulesDetail';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  // state: {
  //   token: null,
  //   isFoldAside: false,
  //   console: {},
  //   stats: {}
  // },
  // getters: {
  //   ramTotal: (state) => {
  //     const total = state.stats.data.total;
  //     if (total) return Number(total.toFixed(2));
  //   }
  // },
  // mutations: {
  //   updateToken(state, val) {
  //     state.token = val;
  //   },
  //   updateIsFoldAside(state, val) {
  //     state.isFoldAside = val;
  //   },
  //   updateConsole(state, val = {}) {
  //     state.console = val;
  //   },
  //   updateStats(state, val = {}) {
  //     state.stats = val;
  //   }
  // },
  // actions: {},
  modules: {
    webSocketOption,
    layoutOption,
    modulesDetail
  },
  plugins: [createPersistedState()]
});
