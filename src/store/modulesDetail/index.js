import { getAllModulesAPI } from '@/api';
export default {
  namespaced: true,
  state: {
    data: [],
    current: null,
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
    async getData({ commit }) {
      const { data: res } = await getAllModulesAPI();
      commit('updateData', res.list);
    }
  },
  getters: {
    getCurrent: (state) => state.current,
    getDialog: (state) => state.dialog,
    getData: (state) => state.data
  }
};
