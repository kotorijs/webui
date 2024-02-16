import { type Sandbox, type User, type Message, spawnId, type Role } from '@/func';
import { defineStore } from 'pinia';

interface storeStateType {
  state: {
    aside: null | boolean;
  };
  token: string;
  sand: Sandbox;
}

/* 定义容器 */
export const useMainStore = defineStore('main', {
  state: (): storeStateType => {
    const userId = spawnId();
    const user2Id = spawnId() + 100;
    const botId = spawnId() + 200;
    const groupId = spawnId() + 300;
    return {
      state: {
        aside: null
      },
      token: '',
      sand: {
        users: [
          {
            id: userId,
            name: 'User',
            age: 18,
            sex: 'male',
            groups: [[groupId, 'owner']],
            users: [user2Id, botId]
          },
          {
            id: user2Id,
            name: 'User2',
            age: 18,
            sex: 'male',
            groups: [[groupId, 'member']],
            users: [userId, botId]
          },
          {
            id: botId,
            name: 'Bot',
            age: 18,
            sex: 'female',
            groups: [[groupId, 'admin']],
            users: [userId, user2Id]
          }
        ],
        groups: [
          {
            id: groupId,
            name: 'testing'
          }
        ],
        message: [],
        current: userId
      }
    };
  },

  persist: {
    storage: localStorage
  },

  getters: {},

  actions: {
    changeStateAside() {
      this.state.aside = !this.state.aside;
    },
    addUser(name: string, age: number, sex: User['sex'], qq?: number) {
      this.sand.users.push({ id: spawnId(), name, age, sex, qq, groups: [], users: [] });
    },
    removeUser(id: number) {
      if (this.sand.current === id) return false;
      if (!this.sand.users.find((el) => el.id === id)) return false;
      this.sand.users = this.sand.users.filter((el) => el.id !== id);
      this.sand.users.forEach((user) => {
        user.users = user.users.filter((el) => el !== id);
      });
      return true;
    },
    addGroup(name: string) {
      this.sand.groups.push({ id: spawnId(), name });
    },
    removeGroup(id: number) {
      if (!this.sand.groups.find((el) => el.id === id)) return false;
      this.sand.groups = this.sand.groups.filter((el) => el.id !== id);
      return true;
    },
    getUser(id: number) {
      return this.sand.users.find((el) => el.id === id);
    },
    getGroup(id: number) {
      return this.sand.groups.find((el) => el.id === id);
    },
    getMsg(scopeId: Message['scopeId']) {
      if (typeof scopeId === 'number') {
        return this.sand.message.filter((el) => typeof el.scopeId === 'number' && el.scopeId === scopeId);
      }
      const total = scopeId[0] + scopeId[1];
      return this.sand.message.filter(
        (el) => typeof el.scopeId !== 'number' && el.scopeId[0] + el.scopeId[1] === total
      );
    },
    sendMsg(message: string, scopeId: number) {
      this.sand.message.push({
        id: spawnId(),
        date: new Date().getTime(),
        user: this.sand.current,
        type: this.getUser(scopeId) ? 'private' : 'group',
        scopeId,
        message
      });
    },
    getUserRole(userId: number, groupId: number) {
      let role: Role = 'member';
      const user = this.getUser(userId);
      user?.groups.forEach((group) => {
        if (role !== 'member') return;
        if (group[0] === groupId) role = group[1];
      });
      return role;
    }
  }
});
