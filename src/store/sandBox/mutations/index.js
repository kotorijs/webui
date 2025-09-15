import Vue from 'vue';
export default {
  // 用户
  ADD_USER(state, user) {
    if (state.users.find((dbUser) => dbUser.id === user.id)) {
      // console.log(`用户${user.id}已存在`);
      return false;
    } else {
      state.users.push(user);
      state.registeredUsersCount++;
      return true;
    }
  },
  ADD_FRIEND(state, { fid, id }) {
    const friend = state.users.find((u) => u.id === fid);
    const user = state.users.find((u) => u.id === id);
    if (!user) return false;
    // 检查是否已是好友
    const isAlreadyFriend = user.friends.some((f) => f.id === fid);
    if (isAlreadyFriend) return false;
    // 添加好友
    Vue.set(user, 'friends', [
      ...(user.friends || []),
      {
        id: friend.id,
        name: friend.name,
        avatar: friend.avatar
      }
    ]);
  },
  REMOVE_FRIEND(state, { fid, id }) {
    const userIndex = state.users.findIndex((u) => u.id === id);
    if (userIndex === -1) return false;

    const friendIndex = state.users[userIndex].friends.findIndex((f) => f.id === fid);
    if (friendIndex === -1) return false;

    if (Array.isArray(state.currentMsg) && state.currentMsg !== null) {
      state.currentMsg = null;
    }
    state.users[userIndex].friends.splice(friendIndex, 1);
    return true;
  },
  REMOVE_USER(state, id) {
    const userIndex = state.users.findIndex((user) => user.id === id);
    if (userIndex <= -1) return console.log(`用户${id}不存在`);
    if (state.currentUser.id === id) {
      state.currentMsg = null;
      state.currentUser = state.users[0] || null;
    }

    state.users.splice(userIndex, 1);
  },

  // 群组
  ADD_GROUP(state, group) {
    if (state.groups.some((dbGroup) => dbGroup.id === group.id)) {
      console.log(`群组${group.id}已存在`);
      return false;
    } else {
      state.groups.push(group);
    }
  },
  REMOVE_GROUP(state, id) {
    if (!state.groups.length) return false;
    const group = state.groups.find((group) => group.id === id);

    group.members.forEach((member) => {
      const user = state.users.find((user) => user.id === member.id);
      const user_group_index = user.groups.findIndex((group) => group.id === id);
      user.groups.splice(user_group_index, 1);
    });

    const groupIndex = state.groups.findIndex((group) => group.id === id);
    if (groupIndex > -1) state.groups.splice(groupIndex, 1);

    // 如果当前群组是被删群组，则清空当前消息
    const currentMsg = state.currentMsg;
    if (!Array.isArray(currentMsg) && currentMsg !== null) {
      currentMsg.id === id && (state.currentMsg = null);
    }
  },
  SET_GROUP_ADMIN(state, { gid, mid }) {
    const group = state.groups.find((group) => group.id === gid);
    if (!group) return false;
    group.admins.push(mid);
    group.members.find((member) => member.id === mid).role = 'admin';

    const user = state.users.find((user) => user.id === mid);
    user.groups.find((group) => group.id === gid).role = 'admin';
  },
  REVOKE_GROUP_ADMIN(state, { gid, mid }) {
    const group = state.groups.find((group) => group.id === gid);
    if (!group) return false;

    const adminIndex = group.admins.findIndex((admin) => admin === mid);
    if (adminIndex > -1) group.admins.splice(adminIndex, 1);

    const memberIndex = group.members.findIndex((member) => member.id === mid);
    if (memberIndex > -1) group.members[memberIndex].role = 'member';

    const user = state.users.find((user) => user.id === mid);
    user.groups.find((group) => group.id === gid).role = 'member';
  },
  ADD_MEMBER(state, { gid, uid, role }) {
    const group = state.groups.find((group) => group.id === gid);
    const member = state.users.find((user) => user.id === uid);
    const groupMsgMuteList = state.groupMsg[gid].muteMembers;
    if (!group || !member) {
      console.error('群组不存在或用户不存在', gid, uid);
      return false;
    }
    group.members.push({ id: uid, role });
    member.groups.push({ id: gid, role });
    groupMsgMuteList.push({ id: member.id, expire_time: null });
  },
  REMOVE_MEMBER(state, { gid, mid }) {
    // 检查群组和成员是否存在
    const group = state.groups.find((group) => group.id === gid);
    if (!group) return console.error('群组不存在', gid);

    // 检查用户是否存在
    const userIndex = state.users.findIndex((user) => user.id === mid);
    if (userIndex === -1) return console.error('用户不存在', mid);

    // 移除用户群聊列表中的群组
    const user = state.users[userIndex];
    const groupIndex = user.groups.findIndex((g) => g.id === gid);
    if (groupIndex !== -1) user.groups.splice(groupIndex, 1);

    // 检查是否为管理员
    const adminIndex = group.admins.findIndex((admin) => admin === mid);
    if (adminIndex > -1) group.admins.splice(adminIndex, 1);

    // 移除群组中的用户
    const memberIndex = group.members.findIndex((m) => m.id === mid);
    if (memberIndex === -1) return console.error('群组成员不存在', mid);
    group.members.splice(memberIndex, 1);

    // 移除群组消息中禁言列表中的用户
    const groupMsgMuteList = state.groupMsg[gid].muteMembers;
    const muteIndex = groupMsgMuteList.findIndex((mute) => mute.id === mid);
    if (muteIndex > -1) groupMsgMuteList.splice(muteIndex, 1);

    // 如果当前群组是被删群组，则清空当前消息
    const currentUser = state.currentUser;
    const currentMsg = state.currentMsg;
    if (user.id === currentUser.id && gid === currentMsg.id) {
      state.currentMsg = null;
    }
  },

  // 消息
  CREATE_PRIVATE_MESSAGE(state, id) {
    // console.log('创建私聊消息', state.privateMsg);
    if (Reflect.has(state.privateMsg, id)) {
      console.log('私聊消息已存在');
      return false;
    }
    Vue.set(state.privateMsg, id, {});
  },
  INIT_PRIVATE_MESSAGE(state, { id, fid }) {
    const selfMsg = state.privateMsg[id];
    if (Reflect.has(selfMsg, fid)) return false;
    Vue.set(selfMsg, fid, []);
  },
  SEND_PRIVATE_MESSAGE(state, { sender, receiver, message }) {
    const senderMsg = state.privateMsg[sender];
    Reflect.has(senderMsg, receiver) || Vue.set(senderMsg, receiver, []); // 创建接收者的消息列表
    senderMsg[receiver].push(message);
  },
  DEL_PRIVATE_MESSAGE(state, { sender, receiver, msgId = false }) {
    if (!msgId) return (state.privateMsg[sender][receiver] = []);

    const index = state.privateMsg[sender][receiver].findIndex((msg) => msg.id === msgId);
    console.log(index);
    if (index <= -1) return console.log('没有此消息');
    state.privateMsg[sender][receiver].splice(index, 1);
  },
  CREATE_GROUP_MESSAGE(state, group) {
    if (Reflect.has(state.groupMsg, group.id)) {
      console.log('群聊消息已存在');
      return false;
    }
    Vue.set(state.groupMsg, group.id, {
      name: group.name,
      id: group.id,
      isMute: false,
      muteMembers: [],
      messages: []
    });
  },
  SEND_GROUP_MESSAGE(state, { gid, message }) {
    if (!state.groupMsg[gid].messages) Vue.set(state.groupMsg[gid], 'messages', []);
    state.groupMsg[gid].messages.push(message);
  },
  DEL_GROUP_MESSAGE(state, { id, msgId = false }) {
    if (!msgId) return (state.groupMsg[id].messages = []);
    if (!state.groupMsg[id].messages.length) return false;

    const index = state.groupMsg[id].messages.findIndex((msg) => msg.id === msgId);
    if (index <= -1) return console.log('没有此消息');
    state.groupMsg[id].messages.splice(index, 1);
  },
  HANDLE_MUTE_GROUP(state, { gid, isMute }) {
    state.groupMsg[gid].isMute = isMute;
  },
  MUTE_MEMBER(state, { gid, mid, duration }) {
    const timestamp_now = Date.now();
    const groupMsg = state.groupMsg[gid];
    const mute_member = groupMsg.muteMembers.find((item) => item.id === mid);
    if (!mute_member) return false;
    const timestamp_expire = timestamp_now + duration * 1000;
    mute_member.expire_time = timestamp_expire;
  },
  UNMUTE_MEMBER(state, { gid, mid }) {
    const groupMsg = state.groupMsg[gid];
    const mute_member = groupMsg.muteMembers.find((item) => item.id === mid);
    if (!mute_member) return false;
    mute_member.expire_time = null;
  },
  CLEAR_USER_MESSAGE(state, id) {
    if (id) {
      // 清空该用户所有好友关于该用户的消息
      const friend_list = state.users.find((user) => user.id === id).friends;
      friend_list.forEach((friend) => {
        Vue.delete(state.privateMsg[friend.id], id);
      });
      // 清空该用户所有消息
      Vue.delete(state.privateMsg, id);
      return true;
    }
    // 清空所有用户消息
    Vue.set(state, 'privateMsg', {});
  },
  CLEAR_GROUP_MESSAGE(state, id) {
    // 清空指定群聊消息
    if (id) {
      return Vue.delete(state.groupMsg, id);
    }

    // 清空所有群聊消息
    Vue.set(state, 'groupMsg', {});
  },

  // 用户切换
  SWITCH_USER(state, id) {
    if (id) {
      const targetUser = state.users.find((user) => user.id === id);
      state.currentUser = targetUser || null;
      return;
    }
    if (state.currentUser === null) state.currentUser = state.users[0];
  },
  // 切换对话窗口
  SWITCH_CHAT(state, msg = null) {
    state.currentMsg = msg;
  },

  // webSocket
  SET_WS_CONNECTION(state, connection) {
    state.wsInstance = connection;
  },
  SET_CONNECTION_STATUS(state, status) {
    state.wsStatus = status;
  },
  SET_SANDBOX_WS_KEEPALIVE(state, status) {
    state.isKeepSandboxWsAlive = status;
  },

  // 禁言
  HANLE_MUTE(state, status) {
    const groupList = state.groupMsg;
    Object.keys(groupList).forEach((key) => {
      groupList[key].muteMembers = [];
      const muteMembers = groupList[key].muteMembers;
      const group = state.groups.find((item) => item.id === key);
      group.members.forEach((member) => {
        const m = { id: member.id, expire_time: null };
        muteMembers.push(m);
      });
    });
  }
};
