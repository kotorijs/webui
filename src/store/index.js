import Vue from 'vue';
import Vuex from 'vuex';
import webSocketOption from './webSocket';
import layoutOption from './layout';
import modulesDetail from './modulesDetail';
import command from './command';
import sandBox from './sandBox';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    webSocketOption,
    layoutOption,
    modulesDetail,
    command,
    sandBox
  },
  plugins: [
    createPersistedState({
      // paths: ['webSocketOption', 'layoutOption', 'sandBox']
      reducer: (state) => {
        const persistedState = { ...state };
        delete persistedState.command;
        delete persistedState.modulesDetail;
        delete persistedState.webSocketOption;
        const { wsInstance, wsStatus, ...persistedSandBox } = persistedState.sandBox;
        persistedState.sandBox = persistedSandBox;
        return persistedState;
      }
    })
  ]
});
