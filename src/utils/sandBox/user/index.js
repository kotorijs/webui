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
    const uid = `user-${id}`;
    const user = store.getters['sandBox/getUserById'](uid);
    const self = store.getters['sandBox/getUserById'](this.id);
    const hasFriend = self.friends.some((friend) => friend.id === uid);
    if (!user || hasFriend) {
      console.log('没有该用户或已经是好友了');
      return false;
    }
    this.friends.push({ name: user.name, id: user.id, messages: [] });
    console.log(user);
    user.receiveFriend(this.id);
    return true;
  }

  receiveFriend(id) {
    const user = store.getters['sandBox/getUserById'](id);
    this.friends.push({ name: user.name, id: user.id, messages: [] });
  }

  /**
   * 删除好友
   * @param {*} friendId 好友id
   */
  removeFriendById(friendId) {
    const fid = `user-${friendId}`;
    this.friends.filter((friend) => friend.id !== fid);
  }

  /**
   * 创建群组
   * @param {*} param0 { groupId：群组id, groupName：群组名称 }
   * @returns 群组对象
   */
  creatGroup({ groupId, groupName }) {
    const lordUserId = `user-${this.id}`;
    const group = new Group({ name: groupName, id: groupId, lord: lordUserId });
    group.addMember({ id: this.id, role: 'lord' });
    this.groups.push(group);
    store.commit('sendBox/ADD_GROUP', group);
    return group;
  }

  /**
   * 删除群组
   * @param {*} id 群组id
   */
  removeGroupById(groupId) {
    const gid = `group-${groupId}`;
    this.groups = this.groups.filter((group) => group.groupId !== gid);
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
