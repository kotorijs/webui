import { getAllModulesAPI } from '@/api';
export default {
  namespaced: true,
  state: {
    data: [],
    current: {},
    dialog: false
  },
  mutations: {
    updateData(state, val = []) {
      state.data = val;
      if (val.length > 0) {
        state.current = val[0];
      }
    },
    updateCurrent(state, val = 0) {
      state.current = state.data[val];
    },
    updateDialog(state, val = false) {
      state.dialog = val;
    }
  },
  actions: {
    getData({ commit }) {
      getAllModulesAPI().then(({ data: res }) => {
        commit('updateData', res.list);
      });
    }
  },
  getters: {
    getCurrent: (state) => state.current,
    getDialog: (state) => state.dialog,
    getData: (state) => state.data
  }
};
