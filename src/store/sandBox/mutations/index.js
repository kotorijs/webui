export default {
  // 用户
  ADD_USER(state, user) {
    if (state.users.find((dbUser) => dbUser.id === user.id)) {
      console.log(`用户${user.id}已存在`);
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
  }
};
