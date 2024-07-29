import Vue from 'vue';
import Vuex from 'vuex';
import webSocketOption from './webSocket';
import layoutOption from './layout';
import modulesDetail from './modulesDetail';
import sendBox from './sendBox';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    webSocketOption,
    layoutOption,
    modulesDetail,
    sendBox
  },
  plugins: [createPersistedState()]
});
