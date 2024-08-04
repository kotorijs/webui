import Group from '../group';
import store from '@/store';

// 用户类
export default class User {
  constructor({ id, name, age, sex }) {
    this.name = name;
    this.id = `user-${id}`;
    this.age = age;
    this.sex = sex;
    this.avatar = `https://k.hotaru.icu/api/data/avatar/${name}`;
    this.groups = [];
    this.friends = [];
    store.commit('sandBox/ADD_USER', this);
  }

  self() {
    return store.getters['sandBox/getUserById'](this.id);
  }

  /**
   * 获取好友列表
   * @returns 对象数组
   */
  getAllFriend() {
    return this.friends;
  }

  /**
   * 通过好友id获取好友消息
   * @param {*} friendId 好友id
   * @returns 好友消息
   */
  getFriendMessageById(friendId) {
    // 通过获取好友信息
    const friendObj = this.friends.find((friend) => friend.id === friendId);
    const hasMessage = this.friends.length && this.friends.find((friend) => friend.id === friendId);
    if (hasMessage) {
      return friendObj.messages;
    }
    return [];
  }

  /**
   * 获取群组列表
   * @returns 群组列表
   */
  getAllGroups() {
    return this.groups;
  }

  /**
   * 通过群组id获取群组信息
   * @param {*} id 群组id
   * @returns 群组信息
   */
  getGroupById(groupId) {
    if (!this.groups.length) return false;
    return this.groups.find((group) => group.id === groupId);
  }

  /**
   * 添加好友
   * @param {*} friendId 好友id
   * @param {*} friendName 好友名称
   */
  addFriend(id) {
    const fid = `user-${id}`;
    const friend = store.getters['sandBox/getUserById'](fid);
    const self = store.getters['sandBox/getUserById'](this.id);
    const hasFriend = self.friends.some((friendItem) => friendItem.id === fid);
    if (!friend || hasFriend) return false;
    self.friends.push({ name: friend.name, id: friend.id, messages: [] });
    this.receiveAddFriend(self, friend);
    return true;
  }

  receiveAddFriend(self, friend) {
    friend.friends.push({ name: self.name, id: self.id, messages: [] });
    console.log(`${self.name}已添加到${friend.name}的好友列表中`);
  }

  /**
   * 删除好友
   * @param {*} friendId 好友id
   */
  removeFriendById(id) {
    const fid = `user-${id}`;
    const friend = store.getters['sandBox/getUserById'](fid);
    const self = store.getters['sandBox/getUserById'](this.id);
    const hasFriend = self.friends.some((friendItem) => friendItem.id === fid);
    if (!hasFriend) return false;
    self.friends = self.friends.filter((friendItem) => friendItem.id !== fid);
    this.receiveRemoveFriend(self, friend);
    return true;
  }

  receiveRemoveFriend(self, friend) {
    friend.friends = friend.friends.filter((friendHandle) => {
      return friendHandle.id !== self.id;
    });
    console.log(`${self.name}已从${friend.name}的好友列表中移除`);
  }

  /**
   * 创建群组
   * @param {*} param0 { groupId：群组id, groupName：群组名称 }
   * @returns 群组对象
   */
  creatGroup({ id, name }) {
    const lordUserId = `user-${this.id}`;
    const group = new Group({ name, id, lord: lordUserId });
    group.addMember({ id: this.id, role: 'lord' });
    this.groups.push(group);
    // store.commit('sendBox/ADD_GROUP', group);
    return group;
  }

  /**
   * 删除群组
   * @param {*} id 群组id
   */
  removeGroupById(groupId) {
    const gid = `group-${groupId}`;
    const group = store.getters['sandBox/getGroupById'](gid);
    const members = group.members;
    const isLord = group.lord === this.id;
    if (!isLord) return false;
    members.forEach((member) => {
      const user = store.getters['sandBox/getUserById'](member.id);
      user.groups = user.groups.filter((group) => group.id !== gid);
    });
    store.commit('sandBox/REMOVE_GROUP', gid);
  }

  addGroupById({ groupId }) {
    const gid = `group-${groupId}`;
    const group = store.getters['sandBox/getGroupById'](gid);
    if (!group) return false;
    const hasMember = group.members.some((member) => member.id === this.id);
    if (hasMember) return false;
    group.members.push({ id: this.id, role: 'member' });
    this.self().groups.push({ id: groupId, role: 'member' });
    return true;
  }

  inviteUserToGroup({ groupId, invitee, role = 'member' }) {
    const gid = `group-${groupId}`;
    const group = store.getters['sandBox/getGroupById'](gid);
    const normalizeInvitee = this._memberNormalize(invitee);
    const hasSelf = group.members.some((m) => m.id === this.id);
    if (!group || !hasSelf) return false;
    const isLord = group.lord === this.id;
    const roleHandle = isLord ? role : 'member';
    normalizeInvitee.forEach((invitee) => {
      const hasMember = group.members.some((m) => m.id === invitee.id);
      if (hasMember) return false;
      group.members.push({ id: invitee.id, role: roleHandle });
      invitee.groups.push({ id: gid, role: roleHandle });
    });
    return true;
  }

  leaveGroupById(id) {
    const gid = `group-${id}`;
    const group = store.getters['sandBox/getGroupById'](gid);
    if (!group) return false;
    this.self().groups = this.self().groups.filter((group) => group.id !== gid);
    group.members = group.members.filter((member) => member.id !== this.id);
    return true;
  }

  kickMemberById({ groupId, expellee }) {
    const expelleeId = `user-${expellee}`;
    const gid = `group-${groupId}`;
    const group = store.getters['sandBox/getGroupById'](gid);
    const exp = store.getters['sandBox/getUserById'](expelleeId);
    if (!group || !exp || expelleeId === this.id) return false;
    const isLord = group.lord === this.id;
    if (!isLord) return false;
    exp.groups = exp.groups.filter((g) => g.id !== gid);
    group.members = group.members.filter((member) => member.id !== exp.id);
    return true;
  }

  // 操作信息
  sendMessageToFriend() {}

  receiveFriendMessage() {}

  deleteFriendMessage() {}

  getFriendMessage() {}

  sendMessageToGroup() {}

  deleteGroupMessage() {}

  getGroupMessage() {}

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
            memberHandle = store.getters['sandBox/getUserById'](`user-${member}`);
            return memberHandle;
          }
        })
        .filter((member) => member); // 过滤掉不存在的用户
    } else if (members instanceof Object) {
      return [members];
    } else {
      memberHandle = store.getters['sandBox/getUserById'](`user-${members}`);
      return memberHandle && typeof memberHandle === 'object' ? [memberHandle] : []; // 检测members是否为有效对象
    }
  }
}