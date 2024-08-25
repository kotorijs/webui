import Vue from 'vue';
import Vuex from 'vuex';
import webSocketOption from './webSocket';
import layoutOption from './layout';
import modulesDetail from './modulesDetail';
import command from './command';
// import sandBox from './sandBox';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    webSocketOption,
    layoutOption,
    modulesDetail,
    command
  },
  plugins: [createPersistedState()]
});
