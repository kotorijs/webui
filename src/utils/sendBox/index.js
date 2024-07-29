import User from './User';
import Group from './Group';
import store from '@/store';

export default class Administrators {
  // 操作用户
  createUser({ id, name, age, sex }) {
    const user = new User({ id, name, age, sex });
    store.commit('sendBox/ADD_USER', user);
    return user;
  }

  getAllUser() {
    return store.getters['sendBox/getAllUser'];
  }

  getUserById(userId) {
    const uid = `user-${userId}`;
    return store.getters['sendBox/getUserById'](uid);
  }

  removeUserById(id) {
    id = `user-${id}`;
    store.commit('sendBox/REMOVE_USER', id);
  }

  // 操作群组
  createGroup({ id, name, members, lord }) {
    lord = `user-${lord}`;
    const group = new Group({ name, id, lord });
    members = this._memberNormalize(members);
    members.forEach((member) => {
      const role = member.id === lord ? 'lord' : 'member';
      member.groups.push({ id, role });
      group.addMember(member.id, member);
    });
    store.commit('sendBox/ADD_GROUP', group);
    return group;
  }

  getAllGroup() {
    return store.getters['sendBox/getAllGroup'];
  }

  getGroupById(groupId) {
    const gid = `group-${groupId}`;
    return store.getters['sendBox/getGroupById'](gid);
  }

  removeGroupById(id) {
    id = `group-${id}`;
    store.commit('sendBox/REMOVE_GROUP', id);
  }

  // 私有方法
  /**
   * @description: 将传入的成员参数进行规范化
   * @param {Array} members
   * @return {Array}
   */
  _memberNormalize(members) {
    if (members instanceof Array) {
      return members
        .map((member) => {
          if (member instanceof Object) {
            return member;
          } else {
            member = store.getters['sendBox/getUserById'](`user-${member}`);
            return member || null;
          }
        })
        .filter((member) => member !== null); // 过滤掉不存在的用户
    } else if (members instanceof Object) {
      return [members];
    } else {
      members = store.getters['sendBox/getUserById'](`user-${members}`);
      return members && typeof members === 'object' ? [members] : []; // 检测members是否为有效对象
    }
  }

  __memberNormalize(members) {
    if (members instanceof Object) return [members];
    if (!(members instanceof Array)) {
      members = store.getters['sendBox/getUserById'](`user-${members}`);
      return members && members instanceof Object ? [members] : [];
    }
    return members
      .map((member) => {
        if (member instanceof Object) return member;
        return store.getters['sendBox/getUserById'](`user-${member}`) || null;
      })
      .filter((member) => member !== null);
  }
}
