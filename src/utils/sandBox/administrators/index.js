import User from '../user';
import Group from '../group';
import store from '@/store';

export default class Administrators {
  // 操作用户
  createUser({ id, name, age, sex }) {
    const user = new User({ id, name, age, sex });
    return user;
  }

  getAllUser() {
    return store.getters['sandBox/getAllUser'];
  }

  getUserById(uid) {
    return store.getters['sandBox/getUserById'](uid);
  }

  removeUserById(uid) {
    store.commit('sandBox/REMOVE_USER', uid);
  }

  // 操作群组
  createGroup({ id, name, members, lord }) {
    const gid = `group-${id}`;
    const normalizeMembers = this._memberNormalize(members);
    const hasGroup = store.getters['sandBox/getGroupById'](gid);
    if (hasGroup) return false;
    const group = new Group({ name, id, lord });
    normalizeMembers.forEach(async (member) => {
      const mid = member.id;
      const hasUser = store.getters['sandBox/getUserById'](mid);
      if (!hasUser) return console.log(`用户${mid}不存在`);
      const role = mid === lord ? 'lord' : 'member';
      member.groups.push({ id: gid, role });
      group.addMember({ id: member.id, role });
    });
    return group;
  }

  getAllGroup() {
    return store.getters['sandBox/getAllGroup'];
  }

  getGroupById(gid) {
    return store.getters['sandBox/getGroupById'](gid);
  }

  removeGroupById(gid) {
    const members = store.getters['sandBox/getGroupById'](gid).members;
    members.forEach((member) => {
      const user = store.getters['sandBox/getUserById'](member.id);
      user.groups = user.groups.filter((group) => group.id !== gid);
    });
    store.commit('sandBox/DEL_GROUP_MESSAGE', { gid });
    store.commit('sandBox/REMOVE_GROUP', gid);
  }

  // 私有方法
  /**
   * @description: 将传入的成员参数进行规范化
   * @param {Array} members
   * @return {Array}
   */
  _memberNormalize(members) {
    let memberHandle;
    if (members instanceof Array) {
      return members
        .map((member) => {
          if (member instanceof Object) {
            return member;
          } else {
            memberHandle = store.getters['sandBox/getUserById'](member);
            return memberHandle;
          }
        })
        .filter((member) => member); // 过滤掉不存在的用户
    } else if (members instanceof Object) {
      return [members];
    } else {
      memberHandle = store.getters['sandBox/getUserById'](members);
      return memberHandle && typeof memberHandle === 'object' ? [memberHandle] : []; // 检测members是否为有效对象
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
