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
    const user = store.getters['sandBox/getUserById'](fid);
    const self = store.getters['sandBox/getUserById'](this.id);
    const hasFriend = self.friends.some((friend) => friend.id === fid);
    if (!user || hasFriend) return false;
    this.friends.push({ name: user.name, id: user.id, messages: [] });
    user.receiveAddFriend(this.id);
    return true;
  }

  receiveAddFriend(id) {
    const friend = store.getters['sandBox/getUserById'](id);
    this.friends.push({ name: friend.name, id: friend.id, messages: [] });
  }

  /**
   * 删除好友
   * @param {*} friendId 好友id
   */
  removeFriendById(id) {
    const fid = `user-${id}`;
    const self = store.getters['sandBox/getUserById'](this.id);
    const hasFriend = self.friends.some((friend) => friend.id === fid);
    if (!hasFriend) return false;
    self.friends.filter((friend) => friend.id !== fid);
  }

  receiveRemoveFriend(id) {
    const friend = store.getters['sandBox/getUserById'](id);
    this.friends.filter((friendHandle) => friendHandle.id !== friend.id);
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
    members.forEach((member) => {
      const user = store.getters['sandBox/getUserById'](member.id);
      user.groups.filter((group) => group.id !== groupId);
      console.log(user);
    });
  }

  addGroup({ groupId, userId, role }) {
    const gid = `group-${groupId}`;
    const uid = `user-${userId}`;
    store.getters['sendBox/getUserById'](uid) &&
      this.groups.includes(gid) &&
      this.groups.find((group) => group.groupId === gid).addMember({ id: uid, role });
  }

  leaveGroup() {}

  // 操作信息
  sendMessageToFriend() {}

  receiveFriendMessage() {}

  deleteFriendMessage() {}

  getFriendMessage() {}

  sendMessageToGroup() {}

  deleteGroupMessage() {}

  getGroupMessage() {}
}
