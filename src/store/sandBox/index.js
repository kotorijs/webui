// import User from '@/utils/sendBox/User';
import mutations from './mutations';
import getters from './getters';
import { nanoid } from 'nanoid';
export default {
  namespaced: true,
  state: {
    users: [],
    groups: [],
    privateMsg: {
      'user-1': { 'user-2': [], 'user-3': [] },
      'user-2': {
        'user-1': [],
        'user-3': [
          { id: nanoid(), role: 'user-2', content: 'hello' },
          { id: nanoid(), role: 'user-3', content: 'hi' }
        ]
      }
    },
    groupMsg: {
      'group-1': {
        name: 'group-1',
        id: 'group-1',
        isMute: false,
        muteMembers: [],
        messages: [{ id: nanoid(), role: 'user-1', content: 'hello' }]
      },
      'group-2': {
        name: 'group-2',
        id: 'group-2',
        isMute: false,
        muteMembers: ['user-2'],
        messages: [
          { id: nanoid(), role: 'user-1', content: 'hello' },
          { id: nanoid(), role: 'user-2', content: 'hello' }
        ]
      }
    }
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
