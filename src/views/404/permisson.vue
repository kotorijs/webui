<template>
  <div>
    <ul class="member-list">
      <li class="member-item" v-for="(user, index) in getMemberList" :key="index">
        <pps-context-menu :menus="getUserMenuItems(user)" @select="contextMenuFn">
          <template v-slot:item="{ menu }">
            <div
              class="menu-item pps-context-menu-item"
              v-for="(item, index) in menu"
              :key="index"
              @click="contextMenuFn(item)"
            >
              {{ item.label }}
            </div>
          </template>

          <div class="user-item" slot="content">
            <pps-avatar :src="user.avatar" size="20"></pps-avatar>
            <span class="user-name">{{ user.name }}</span>
            <span :class="user.role" class="user-role">
              {{ tranRoleFn(user.role) }}
            </span>
          </div>
        </pps-context-menu>
      </li>
    </ul>
  </div>
</template>

<script>
import f from '@/utils/sandBox/permissionService';
export default {
  methods: {
    getUserMenuItems(user) {
      return f.getVisibleMenuItems({ id: 'user-2', role: 'member' }, user, 'group1');
    },
    contextMenuFn(item) {
      switch (item.key) {
        case 'VIEW_PROFILE':
          console.log('查看用户信息');
          break;
        case 'AT_USER':
          console.log('at user');
          break;
        case 'ADD_FRIEND':
          console.log('添加好友');
          break;
        case 'MUTE_USER':
          console.log('禁言用户');
          break;
        case 'REMOVE_USER':
          console.log('移除用户');
          break;
        case 'SET_ADMIN':
          console.log('设置管理员');
          break;
        case 'REVOKE_ADMIN':
          console.log('取消管理员');
          break;
      }
    },
    tranRoleFn(role) {
      const roleMap = {
        lord: '群主',
        admin: '管理员',
        'super-admin': '超级管理员'
      };
      return roleMap[role] || '';
    }
  },
  data() {
    return {
      getMemberList: [
        {
          role: 'admin',
          id: 'user-2',
          avatar: 'https://k.hotaru.icu/api/data/avatar/u2',
          name: 'u2',
          sex: '女',
          age: '2',
          numId: '2'
        },
        {
          role: 'member',
          id: 'user-3',
          avatar: 'https://k.hotaru.icu/api/data/avatar/u3',
          name: 'u3',
          sex: '男',
          age: '3',
          numId: '3'
        },
        {
          role: 'member',
          id: 'user-4',
          avatar: 'https://k.hotaru.icu/api/data/avatar/u4',
          name: 'u4',
          sex: '女',
          age: '4',
          numId: '4'
        },
        {
          role: 'member',
          id: 'user-5',
          avatar: 'https://k.hotaru.icu/api/data/avatar/u5',
          name: 'u5',
          sex: '男',
          age: '5',
          numId: '5'
        },
        {
          role: 'lord',
          id: 'user-1',
          avatar: 'https://k.hotaru.icu/api/data/avatar/u1',
          name: 'u1',
          sex: '男',
          age: '1',
          numId: '1'
        },
        {
          role: 'super-admin',
          id: 'user-super-admin',
          avatar: 'https://k.hotaru.icu/api/data/avatar/super',
          name: '超级管理员',
          sex: 'bot',
          age: '100',
          numId: 'super-admin'
        }
      ]
    };
  },
  mounted() {
    const res = f.getVisibleMenuItems(
      { id: 'u1', role: 'member' },
      { id: 'u2', role: 'member' },
      'group1'
    );
    console.log(res);
  }
};
</script>

<style></style>
