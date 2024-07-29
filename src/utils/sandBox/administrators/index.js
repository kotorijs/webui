import User from '../user';
import Group from '../group';
import store from '@/store';

export default class Administrators {
  // 操作用户
  createUser({ id, name, age, sex }) {
    const user = new User({ id, name, age, sex });
    store.commit('sandBox/ADD_USER', user);
    return user;
  }

  getAllUser() {
    return store.getters['sandBox/getAllUser'];
  }

  getUserById(userId) {
    const uid = `user-${userId}`;
    return store.getters['sandBox/getUserById'](uid);
  }

  removeUserById(id) {
    id = `user-${id}`;
    store.commit('sandBox/REMOVE_USER', id);
  }

  // 操作群组
  createGroup({ id, name, members, lord }) {
    lord = `user-${lord}`;
    const group = new Group({ name, id, lord });
    members = this._memberNormalize(members);
    members.forEach((member) => {
      const role = member.id === lord ? 'lord' : 'member';
      member.groups.push({ id, role });
      group.addMember({ id: member.id, role });
    });
    store.commit('sandBox/ADD_GROUP', group);
    return group;
  }

  getAllGroup() {
    return store.getters['sandBox/getAllGroup'];
  }

  getGroupById(groupId) {
    const gid = `group-${groupId}`;
    return store.getters['sandBox/getGroupById'](gid);
  }

  removeGroupById(id) {
    id = `group-${id}`;
    store.commit('sandBox/REMOVE_GROUP', id);
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
            member = store.getters['sandBox/getUserById'](`user-${member}`);
            return member || null;
          }
        })
        .filter((member) => member !== null); // 过滤掉不存在的用户
    } else if (members instanceof Object) {
      return [members];
    } else {
      members = store.getters['sandBox/getUserById'](`user-${members}`);
      return members && typeof members === 'object' ? [members] : []; // 检测members是否为有效对象
    }
  }

  __memberNormalize(members) {
    if (members instanceof Object) return [members];
    if (!(members instanceof Array)) {
      members = store.getters['sandBox/getUserById'](`user-${members}`);
      return members && members instanceof Object ? [members] : [];
    }
    return members
      .map((member) => {
        if (member instanceof Object) return member;
        return store.getters['sandBox/getUserById'](`user-${member}`) || null;
      })
      .filter((member) => member !== null);
  }
}
