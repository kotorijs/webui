// 角色权限级别
const ROLE_LEVEL = {
  member: 1,
  admin: 2,
  lord: 3,
  'super-admin': 4
};

// 菜单项定义
const MENU_ITEMS = {
  VIEW_PROFILE: {
    label: '查看资料',
    roles: ['member', 'admin', 'lord', 'super-admin']
  },
  AT_USER: {
    label: '@ TA',
    roles: ['member', 'admin', 'lord', 'super-admin'],
    excludeSelf: true
  },
  ADD_FRIEND: {
    label: '添加好友',
    roles: ['member', 'admin', 'lord', 'super-admin'],
    excludeSelf: true,
    friendRelation: 'not-friend'
  },
  REMOVE_FRIEND: {
    label: '移除好友',
    roles: ['member', 'admin', 'lord', 'super-admin'],
    excludeSelf: true,
    friendRelation: 'friend'
  },
  MUTE_USER: {
    label: '设置禁言',
    roles: ['admin', 'lord', 'super-admin'],
    minTargetLevel: 1, // 只能禁言普通成员
    maxTargetLevel: 1, // 只能禁言普通成员
    requireNotMuted: true
  },
  UNMUTE_USER: {
    label: '取消禁言',
    roles: ['admin', 'lord', 'super-admin'],
    minTargetLevel: 1, // 只能取消普通成员的禁言
    maxTargetLevel: 1, // 只能取消普通成员的禁言
    requireMuted: true
  },
  REMOVE_USER: {
    label: '移出本群',
    roles: ['admin', 'lord', 'super-admin'],
    minTargetLevel: 1,
    maxTargetLevel: 1
  },
  SET_ADMIN: {
    label: '设为管理',
    roles: ['lord', 'super-admin'],
    minTargetLevel: 1,
    maxTargetLevel: 1,
    requireNotAdmin: true
  },
  REVOKE_ADMIN: {
    label: '撤销管理',
    roles: ['lord', 'super-admin'],
    minTargetLevel: 2,
    maxTargetLevel: 2,
    requireAdmin: true
  }
};

/**
 * 获取用户可见的菜单项
 * @param {Object} currentUser - 当前操作者
 * @param {Object} targetUser - 目标用户
 * @param {Object} group - 群组信息
 * @returns {Array} 可见的菜单项列表
 */
export const getVisibleMenuItems = (currentUser = { role: null, id: null }, targetUser, group) => {
  if (!targetUser) return [];

  // eslint-disable-next-line no-unused-vars
  const currentLevel = ROLE_LEVEL[currentUser.role] || 0;
  const targetLevel = ROLE_LEVEL[targetUser.role] || 0;
  const isFriend = isMemberFriend(currentUser, targetUser);
  const isMuted = isMemberMuted(targetUser, group);
  const isAdmin = isMemberAdmin(targetUser, group);

  return Object.entries(MENU_ITEMS)
    .filter(([key, item]) => {
      const {
        roles,
        excludeSelf,
        friendRelation,
        minTargetLevel,
        maxTargetLevel,
        requireMuted,
        requireNotMuted,
        requireAdmin,
        requireNotAdmin
      } = item;
      // 检查当前用户是否有权限
      if (!roles.includes(currentUser.role)) return errorLogFn('您没有权限执行此操作');

      // 排除自身操作
      if (excludeSelf && currentUser.id === targetUser.id) return errorLogFn('您不能操作自己');

      // 检查目标用户等级限制
      if (minTargetLevel && targetLevel < minTargetLevel) return errorLogFn('目标用户等级不足');
      if (maxTargetLevel && targetLevel > maxTargetLevel) return errorLogFn('目标用户等级过高');

      // 检查用户是否符合好友关系
      if (friendRelation === 'friend' && !isFriend) return errorLogFn('您不是好友关系');
      if (friendRelation === 'not-friend' && isFriend) return errorLogFn('您已经是好友关系');

      // 检查禁言状态
      if (requireMuted && !isMuted) return errorLogFn('用户未被禁言');
      if (requireNotMuted && isMuted) return errorLogFn('用户被已禁言');

      // 检查是否为管理员
      if (requireAdmin && !isAdmin) return errorLogFn('用户不是群组管理员');
      if (requireNotAdmin && isAdmin) return errorLogFn('用户是群组管理员');

      return true;
    })
    .map(([key, item]) => ({
      key,
      label: item.label,
      uid: targetUser.id,
      task: key.toLowerCase().replace(/_/g, '-')
    }));
};
// eslint-disable-next-line node/handle-callback-err
const errorLogFn = (error) => {
  // console.error(error);
  return false;
};
const isMemberMuted = (targetUser, group) => {
  return group.getAllMessage().muteMembers.includes(targetUser.id) || false;
};
const isMemberFriend = (currentUser, targetUser) => {
  return currentUser.friends.some(({ id }) => id === targetUser.id);
};
const isMemberAdmin = (targetUser, group) => {
  const member = group.getMemberById(targetUser.id);
  const role_m = member.role;
  const role_g = targetUser.groups.find(({ id }) => id === group.id).role;
  if (role_m === 'admin' || role_g === 'admin') return true;
  return false;
};
