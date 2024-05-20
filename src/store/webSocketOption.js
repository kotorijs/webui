const cpu = { rate: null, speed: null };
const ram = { total: null, unused: null, used: null, rate: null };
const console = {
  type: '',
  data: { level: null, time: null, pid: null, label: [], msg: '' }
};
export default {
  namespaced: true,
  state: {
    cpu,
    ram,
    console
  },
  mutations: {
    updateCpu(state, val = { ...cpu }) {
      state.cpu = val;
    },
    updateRam(state, val = { ...ram }) {
      state.ram = val;
    },
    updateConsole(state, val = { ...console }) {
      console.log(val);
      // state.console = val;
    }
  },
  actions: {},
  getters: {
    roundedRam(state) {
      const ram = {};
      for (const key in state.ram) {
        if (Object.hasOwnProperty.call(state.ram, key)) {
          ram[key] = Number(state.ram[key]).toFixed(2);
        }
      }
      return ram;
    },
    roundedCpu(state) {
      return { ...state.cpu, rate: Number(state.cpu.rate).toFixed(2) };
    }
  }
};
