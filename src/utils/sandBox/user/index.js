import Group from '../group';
import store from '@/store';
import { nanoid } from 'nanoid';

const ROLE_SELF = 'self';
const ROLE_FRIEND = 'friend';
const USER_PREFIX = 'user-';
const GROUP_PREFIX = 'group-';

// 用户类
export default class User {
  constructor({ id, name, age, sex, avatar }) {
    this.name = name;
    this.id = `${USER_PREFIX}${id}`;
    this.age = age;
    this.sex = sex;
    this.avatar = avatar || `https://k.hotaru.icu/api/data/avatar/${name}`;
    this.groups = [];
    this.friends = [];
    store.commit('sandBox/ADD_USER', this);
    store.commit('sandBox/CREATE_PRIVATE_MESSAGE', this.id);
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
    const fid = `${USER_PREFIX}${id}`;
    const friend = store.getters['sandBox/getUserById'](fid);
    const self = store.getters['sandBox/getUserById'](this.id);
    const hasFriend = self.friends.some((friendItem) => friendItem.id === fid);
    if (!friend || hasFriend) return false;
    self.friends.push({ name: friend.name, id: friend.id });
    const selfMsg = store.getters['sandBox/getPrivateMessage'](this.id);
    if (!Reflect.has(selfMsg, fid)) store.getters['sandBox/getPrivateMessage'](this.id)[fid] = [];
    this.receiveAddFriend(self, friend);
    return true;
  }

  receiveAddFriend(self, friend) {
    friend.friends.push({ name: self.name, id: self.id });
    const frdMsg = store.getters['sandBox/getPrivateMessage'](friend.id);
    if (!Reflect.has(frdMsg, self.id)) {
      store.getters['sandBox/getPrivateMessage'](friend.id)[self.id] = [];
      console.log(`${self.name}已添加到${friend.name}的好友列表中`);
    }
  }

  /**
   * 删除好友
   * @param {*} friendId 好友id
   */
  removeFriendById(id) {
    const fid = `${USER_PREFIX}${id}`;
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
    const lordUserId = `${USER_PREFIX}${this.id}`;
    const group = new Group({ name, id, lord: lordUserId });
    group.addMember({ id: this.id, role: 'lord' });
    this.groups.push(group);
    return group;
  }

  /**
   * 删除群组
   * @param {*} id 群组id
   */
  removeGroupById(groupId) {
    const gid = `${GROUP_PREFIX}${groupId}`;
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
    const gid = `${GROUP_PREFIX}${groupId}`;
    const group = store.getters['sandBox/getGroupById'](gid);
    if (!group) return false;
    const hasMember = group.members.some((member) => member.id === this.id);
    if (hasMember) return false;
    group.members.push({ id: this.id, role: 'member' });
    this.self().groups.push({ id: groupId, role: 'member' });
    return true;
  }

  inviteUserToGroup({ groupId, invitee, role = 'member' }) {
    const gid = `${GROUP_PREFIX}${groupId}`;
    const group = store.getters['sandBox/getGroupById'](gid);
    const normalizeInvitee = this._memberNormalize(invitee);
    const hasSelf = group.members.some((m) => m.id === this.id);
    if (!group || !hasSelf) return false;
    const isLord = group.lord === this.id;
    const roleHandle = isLord ? role : 'member';
    normalizeInvitee.forEach((invitee) => {
      const hasMember = group.members.some((m) => m.id === invitee.id);
      if (hasMember) return false;
      if (roleHandle === 'admin') group.admins.push(invitee.id);
      group.members.push({ id: invitee.id, role: roleHandle });
      invitee.groups.push({ id: gid, role: roleHandle });
    });
    return true;
  }

  leaveGroupById(id) {
    const gid = `${GROUP_PREFIX}${id}`;
    const group = store.getters['sandBox/getGroupById'](gid);
    if (!group) return false;
    this.self().groups = this.self().groups.filter((group) => group.id !== gid);
    group.members = group.members.filter((member) => member.id !== this.id);
    return true;
  }

  kickMemberById({ groupId, expellee }) {
    const expelleeId = `${USER_PREFIX}${expellee}`;
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

  sendMessageToFriend({ id, content }) {
    const fid = `${USER_PREFIX}${id}`;
    if (!this.self().friends.some((friend) => friend.id === fid)) return false;
    const msgId = nanoid();
    const message = { id: msgId, role: ROLE_SELF, content };
    const msgOption = { sender: this.id, receiver: fid, message };
    store.commit('sandBox/SEND_PRIVATE_MESSAGE', msgOption);
    this.receiveFriendMessage({ id, content, msgId });
  }

  receiveFriendMessage({ id, content, msgId }) {
    const fid = `${USER_PREFIX}${id}`;
    const message = { id: msgId, role: ROLE_FRIEND, content };
    const msgOption = { sender: fid, receiver: this.id, message };
    store.commit('sandBox/SEND_PRIVATE_MESSAGE', msgOption);
  }

  deleteFriendMessage({ id, msgId }) {
    const fid = `${USER_PREFIX}${id}`;
    if (!this.self().friends.some((friend) => friend.id === fid)) return false;
    store.commit('sandBox/DEL_PRIVATE_MESSAGE', { sender: this.id, receiver: fid, msgId });
    store.commit('sandBox/DEL_PRIVATE_MESSAGE', { sender: fid, receiver: this.id, msgId });
  }

  sendMessageToGroup({ id, content }) {
    const gid = `${GROUP_PREFIX}${id}`;
    const group = store.getters['sandBox/getGroupById'](gid);
    if (!group) return false;
    const hasMember = group.members.some((member) => member.id === this.id);
    if (!hasMember) return false;
    const groupMsg = store.getters['sandBox/getGroupMessage'](gid);
    const hasMute = groupMsg.isMute || groupMsg.muteMembers.includes(this.id);
    const isAdmin = group.admins.includes(this.id) || group.lord === this.id;
    if (!isAdmin && hasMute) return false;
    const message = { id: nanoid(), role: this.id, content };
    store.commit('sandBox/SEND_GROUP_MESSAGE', { gid, message });
  }

  deleteGroupMessage({ id, msgId }) {
    const gid = `${GROUP_PREFIX}${id}`;
    const group = store.getters['sandBox/getGroupById'](gid);
    if (!group) return false;
    const hasMember = group.members.some((member) => member.id === this.id);
    if (!hasMember) return false;
    const groupMsg = store.getters['sandBox/getGroupMessage'](gid);
    const hasMessage = groupMsg.messages.some((message) => message.id === msgId);
    if (!hasMessage) return false;
    const isAdmin = group.admins.includes(this.id) || group.lord === this.id;
    const isMyMessage = groupMsg.messages.find((message) => message.id === msgId).role === this.id;
    if (!isAdmin && !isMyMessage) return false;
    store.commit('sandBox/DEL_GROUP_MESSAGE', { gid, msgId });
  }

  getFriendMessage() {}

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
