// import User from '@/utils/sendBox/User';
export default {
  namespaced: true,
  state: {
    users: [],
    groups: []
  },
  mutations: {
    // 用户
    ADD_USER(state, user) {
      if (state.users.find((dbUser) => dbUser.id === user.id)) {
        console.log('用户已存在');
        return false;
      } else {
        state.users.push(user);
      }
    },
    REMOVE_USER(state, id) {
      const hasUser = state.users.length && state.users.find((user) => user.id === id);
      if (hasUser) {
        state.users = state.users.filter((user) => user.id !== id);
      } else {
        console.log('用户不存在');
        return false;
      }
    },
    CLEAR_USERS(state) {
      state.users = [];
    },

    // 群组
    ADD_GROUP(state, group) {
      if (state.groups.find((dbGroup) => dbGroup.id === group.id)) {
        console.log('群组已存在');
        return false;
      } else {
        state.groups.push(group);
      }
    },
    REMOVE_GROUP(state, id) {
      const hasGroup = state.groups.length && state.groups.find((group) => group.id === id);
      if (hasGroup) {
        state.groups = state.groups.filter((group) => group.id !== id);
      } else {
        console.log('群组不存在');
        return false;
      }
    },
    CLEAR_GROUPS(state) {
      state.groups = [];
    }
  },
  actions: {},
  getters: {
    getUserById: (state) => (id) => {
      if (!state.users.length) {
        console.log('用户不存在');
        return false;
      }
      return state.users.find((user) => user.id === id) || false;
    },
    getAllUser: (state) => {
      return state.users;
    },
    getGroupById: (state) => (id) => {
      if (!state.groups.length) {
        console.log('群组不存在');
        return false;
      }
      return state.groups.find((group) => group.id === id) || false;
    },
    getAllGroup: (state) => {
      return state.groups;
    }
  }
};
