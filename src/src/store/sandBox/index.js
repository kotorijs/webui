// import User from '@/utils/sendBox/User';
import mutations from './mutations';
import getters from './getters';
export default {
  namespaced: true,
  state: {
    users: [],
    currentUser: null,
    groups: [],
    privateMsg: {},
    groupMsg: {}
  },
  mutations,
  getters,
  actions: {
    hasUser(context, id) {
      return context.state.users.some((user) => user.id === id);
    },
    hasGroup(context, id) {
      const gid = `group-${id}`;
      return context.state.groups.some((group) => group.id === gid);
    }
  }
};
