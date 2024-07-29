import Group from './Group';
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
  addFriend(friendId, friendName) {
    this.friends.push({ name: friendName, id: friendId, messages: [] });
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
    group.addMember(this.userId, this);
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
    store.getters['sendBox/getUserById'](uid) !== undefined &&
      this.groups.includes(gid) &&
      this.groups.find((group) => group.groupId === gid).addMember(uid, role);
    // const currentGroup = this.groups.find((group) => group.groupId === gid);
    // const currentUser = this.friends.get(uid);
    // const user = {
    //   age: currentUser.age,
    //   sex: currentUser.sex,
    //   avatar: currentUser.avatar,
    //   nickName: currentUser.nickName,
    //   userId: currentUser.userId,
    //   role
    // };
    // console.log(user);
    // currentGroup.addMember(userId, user);
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
