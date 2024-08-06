export default {
  // 用户
  ADD_USER(state, user) {
    if (state.users.find((dbUser) => dbUser.id === user.id)) {
      // console.log(`用户${user.id}已存在`);
      return false;
    } else {
      state.users.push(user);
      return true;
    }
  },
  UPDATE_USER(state, user) {
    console.log('需要被更新的用户', user);
    state.users = state.users.map((dbUser) => {
      if (dbUser.id === user.id) {
        return user;
      } else {
        return dbUser;
      }
    });
  },
  REMOVE_USER(state, id) {
    const hasUser = state.users.length && state.users.find((user) => user.id === id);
    if (hasUser) {
      state.users = state.users.filter((user) => user.id !== id);
    } else {
      console.log(`用户${id}不存在`);
      return false;
    }
  },
  CLEAR_USERS(state) {
    state.users = [];
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
    // const hasGroup = state.groups.length && state.groups.find((group) => group.id === id);
    // console.log(hasGroup);
    // if (hasGroup) {
    //   state.groups = state.groups.filter((group) => group.id !== id);
    // } else {
    //   console.log('群组不存在');
    //   return false;
    // }

    if (!state.groups.length) return false;
    state.groups = state.groups.filter((group) => group.id !== id);
  },
  CLEAR_GROUPS(state) {
    state.groups = [];
  },

  // 消息
  CREATE_PRIVATE_MESSAGE(state, id) {
    // console.log('创建私聊消息', state.privateMsg);
    if (Reflect.has(state.privateMsg, id)) {
      console.log('私聊消息已存在', state.privateMsg[id]);
      return false;
    }
    state.privateMsg[id] = {};
  },
  CREATE_GROUP_MESSAGE(state, group) {
    state.groupMsg[group.id] = {
      name: group.name,
      id: group.id,
      isMute: false,
      muteMembers: [],
      messages: []
    };
  },

  SEND_PRIVATE_MESSAGE(state, { sender, receiver, message }) {
    const senderMsg = state.privateMsg[sender];
    const friendMsg = senderMsg[receiver];
    if (Reflect.has(senderMsg, receiver)) friendMsg.push(message);
    else senderMsg[receiver] = [message];
  },
  SEND_GROUP_MESSAGE(state, { id, message }) {},
  DEL_PRIVATE_MESSAGE(state, { mid, fid }) {},
  DEL_GROUP_MESSAGE(state, id) {},
  MUTE_GROUP(state, id) {
    state.groupMsg[id].isMute = true;
  },
  UNMUTE_GROUP(state, id) {
    state.groupMsg[id].isMute = false;
  },
  MUTE_MEMBER(state, { groupId, memberId }) {
    const groupMsg = state.groupMsg[groupId];
    if (groupMsg && !groupMsg.muteMembers.includes(memberId)) groupMsg.muteMembers.push(memberId);
  },
  UNMUTE_MEMBER(state, { groupId, memberId }) {
    const groupMsg = state.groupMsg[groupId];
    if (groupMsg && groupMsg.muteMembers.includes(memberId)) {
      groupMsg.muteMembers = groupMsg.muteMembers.filter((id) => id !== memberId);
    }
  },

  // 用户切换
  SWITCH_USER(state, id) {
    state.currentUser = id;
  }
};
