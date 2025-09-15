import { getCommandsAPI, updateCommandConfigAPI } from '@/api';

export default {
  namespaced: true,
  state: {
    commands: [],
    current: null
  },
  mutations: {
    UPDATE_COMMANDS(state, val = []) {
      state.commands = val;
    },
    UPDATE_CURRENT(state, val = false) {
      if (val) state.current = state.commands.find((item) => item.name === val);
      else state.current = state.commands[0];
    }
  },
  actions: {
    getCommands({ commit }, name) {
      getCommandsAPI().then((res) => {
        commit('UPDATE_COMMANDS', res.data);
        commit('UPDATE_CURRENT', name);
      });
    },
    updateCommands(context, { name, config }) {
      updateCommandConfigAPI(name, config)
        .then((res) => {
          context.dispatch('getCommands', name);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
  getters: {
    getCmds: (state) => state.commands,
    getCmdByName: (state) => {
      return (name) => state.commands.filter((item) => item.name === name) || [];
    },
    getCmdByShortcut: (state) => {
      return (shortcut) => {
        return state.commands.filter((item) => item.data.shortcut.includes(shortcut)) || [];
      };
    },
    getCurrent: (state) => state.current,
    getCmdByAlias: (state) => {
      return (alias) => state.commands.filter((item) => item.data.alias.includes(alias)) || [];
    },
    getCmdByScope: (state) => {
      return (scope) => state.commands.filter((item) => item.data.scope === scope) || [];
    },
    getCmdByAccess: (state) => {
      return (access) => state.commands.filter((item) => item.data.access === access) || [];
    }
  }
};
