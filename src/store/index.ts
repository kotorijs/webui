import { type Sandbox, type User, type Message, spawnId, type Role } from '@/func';
import Ws from '@/func/ws';
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
    const user2Id = spawnId();
    const botId = spawnId();
    const groupId = spawnId();
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
        current: userId,
        bot: botId,
        address: 'ws://127.0.0.1:233'
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
    getMsg(scopeId: Message['scopeId'], origin?: number) {
      const from = origin ?? this.sand.current;
      const id = this.getUser(scopeId) ? scopeId + from : scopeId;
      return this.sand.message.filter((el) => el.scopeId === id);
    },
    sendMsg(message: string, scopeId: number, origin?: number) {
      const from = origin ?? this.sand.current;
      const realScopeId = this.getUser(scopeId) ? scopeId + from : scopeId;
      const messageId = spawnId();
      this.sand.message.push({
        id: messageId,
        date: new Date().getTime(),
        user: from,
        type: realScopeId === scopeId ? 'group' : 'private',
        scopeId: realScopeId,
        message
      });
      if (!Ws.ws) return;
      const self = this.getUser(from);
      if (realScopeId === scopeId) {
        const group = self?.groups.find((el) => el[0] === scopeId) ?? [];
        Ws.ws.send({
          event: 'on_message',
          type: 1,
          userId: from,
          messageId,
          message,
          sender: {
            nickname: self?.name,
            age: self?.age,
            sex: self?.sex,
            level: '0',
            role: group[1],
            title: ''
          },
          groupId: group[0]
        });
      } else {
        Ws.ws.send({
          event: 'on_message',
          type: 0,
          userId: from,
          messageId,
          message,
          sender: {
            nickname: self?.name,
            age: self?.age,
            sex: self?.sex
          }
        });
      }
    },
    getUserRole(userId: number, groupId: number) {
      let role: Role = 'member';
      const user = this.getUser(userId);
      user?.groups.forEach((group) => {
        if (role !== 'member') return;
        if (group[0] === groupId) role = group[1];
      });
      return role;
    },
    createGroup() {
      this.sand.groups.push({
        id: spawnId(),
        name: `Group${spawnId().toString().substring(0, 3)}`
      });
    },
    createUser() {
      this.sand.users.push({
        id: spawnId(),
        sex: Math.random() > 0.5 ? 'male' : 'female',
        users: this.sand.users.map((user) => user.id),
        groups: this.sand.groups.map((group) => [group.id, 'member']),
        name: `User${spawnId().toString().substring(0, 3)}`,
        age: Number(spawnId().toString().substring(4, 6))
      });
    }
  }
});
