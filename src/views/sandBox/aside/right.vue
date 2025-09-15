<template>
  <transition>
    <div class="right-aside-wapper">
      <k-sb-aside class="aside-group">
        <div class="member-title">
          <div class="title">群聊成员-{{ getGroupMemberLength }}人</div>
          <div class="btn-area">
            <!-- 邀请好友 -->
            <gray-button class="icon-btn" @click.native="isShowFriendList = true">
              <el-tooltip effect="dark" content="邀请加群" placement="top">
                <svg
                  t="1723230695956"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="34315"
                  width="16"
                  height="16"
                  data-spm-anchor-id="a313x.search_index.0.i6.27883a81IeQ0Uy"
                >
                  <path
                    d="M914.618182 477.090909H546.909091V109.381818c0-18.618182-16.290909-34.909091-34.909091-34.909091s-34.909091 16.290909-34.909091 34.909091v367.709091H109.381818c-18.618182 0-34.909091 16.290909-34.909091 34.909091s16.290909 34.909091 34.909091 34.909091h367.709091v367.709091c0 18.618182 16.290909 34.909091 34.909091 34.909091s34.909091-16.290909 34.909091-34.909091V546.909091h367.709091c18.618182 0 34.909091-16.290909 34.909091-34.909091s-16.290909-34.909091-34.909091-34.909091z"
                    fill="#7a7a7a"
                    p-id="34316"
                  ></path>
                </svg>
              </el-tooltip>
            </gray-button>
            <!-- 全体禁言 -->
            <gray-button v-if="isShowMuteBtn" class="icon-btn" @click.native="muteGroup">
              <el-tooltip
                effect="dark"
                :content="isMuteAll ? '解开禁言' : '全体禁言'"
                placement="top"
              >
                <i :class="muteBtnClass"></i>
              </el-tooltip>
            </gray-button>
            <!-- 退出群聊 -->
            <gray-button class="icon-btn leave" @click.native="leaveGroupFn()">
              <el-tooltip effect="dark" content="退出群聊" placement="top">
                <i class="layui-icon layui-icon-close"></i>
              </el-tooltip>
            </gray-button>
          </div>
        </div>

        <template #inner>
          <ul class="member-list">
            <li
              class="member-item"
              @click="viewUserProfile(user)"
              v-for="(user, index) in sortedMemberList"
              :key="index"
            >
              <pps-context-menu :menus="getUserMenuItems(user)" @select="avatarContextMenuFn">
                <div class="user-item" slot="content">
                  <pps-avatar :src="user.avatar" size="20"></pps-avatar>
                  <div class="user-name">{{ user.name }}</div>
                  <div v-if="chatTarget.isGroup" :class="user.role" class="user-role">
                    {{ tranRoleFn(user.role) }}
                  </div>
                </div>
              </pps-context-menu>
            </li>
          </ul>
        </template>
      </k-sb-aside>

      <pps-dialog :show.sync="isShowFriendList" title="好友列表">
        <template v-slot:content>
          <el-table :show-header="true" :data="getCurrentUser.friends">
            <el-table-column align="center" label="头像">
              <template slot-scope="scope">
                <pps-avatar :src="scope.row.avatar" size="40"></pps-avatar>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="id" label="id"></el-table-column>
            <el-table-column align="center" prop="name" label="昵称"></el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="{ row }">
                <pps-button
                  :disabled="isInvited(row)"
                  :theme="isInvited(row) ? 'primary' : 'confirm'"
                  @click="inviteFriendFn(row)"
                >
                  {{ isInvited(row) ? '已进群' : '邀请' }}
                </pps-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </pps-dialog>
    </div>
  </transition>
</template>

<script>
import { tranRoleMixin } from '@/mixin/index';
import { getVisibleMenuItems } from '@/utils/sandBox/permissionService';
import kSbAside from '@/components/layout/aside';
import Group from '@/utils/sandBox/group';
import User from '@/utils/sandBox/user';
import Administrators from '@/utils/sandBox/administrators';
import { mapGetters } from 'vuex';
import grayButton from '../ui/grayButton.vue';
export default {
  name: 'sb-right-aside',
  components: { kSbAside, grayButton },
  mixins: [tranRoleMixin],
  data() {
    return {
      admin: new Administrators(),
      group: null,
      isShowFriendList: false
    };
  },
  methods: {
    getUserMenuItems(user) {
      const curUer = this.memberList.find(({ id }) => id === this.getCurrentUser.id);
      const group = new Group({ id: this.chatTarget.id });
      const menu = getVisibleMenuItems(curUer, user, group);
      return menu;
    },
    viewUserProfile(user) {
      this.$emit('handleMenuAction', {
        targetUser: user,
        actionType: 'VIEW_PROFILE'
      });
    },
    inviteFriendFn(user) {
      this.$emit('handleMenuAction', {
        targetUser: user,
        actionType: 'INVITE_FRIEND',
        groupId: this.chatTarget.id
      });
    },
    isInvited(user) {
      const isEnter = new Group({ id: this.chatTarget.id }).getMemberById(user.id);
      if (!isEnter) return false;
      return true;
    },
    leaveGroupFn() {
      this.$dialog({ title: '警告', content: '确定要退出群聊吗？' })
        .then((action) => {
          const user = this.getCurrentUser;
          console.log(this.group, user);
          if (this.group.lord === user.id) {
            this.$emit('handleMenuAction', {
              actionType: 'REMOVE_GROUP',
              groupId: this.chatTarget.id,
              targetUser: user
            });
          } else {
            this.$emit('handleMenuAction', {
              actionType: 'LEAVE_GROUP',
              groupId: this.chatTarget.id,
              targetUser: user
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    muteGroup() {
      const isMute = new User(this.getCurrentUser).getGroupMessageById(this.chatTarget.id).isMute;

      this.$emit('handleMenuAction', {
        actionType: 'MUTE_GROUP',
        groupId: this.chatTarget.id,
        currentUser: !isMute
      });
    }
  },
  computed: {
    ...mapGetters('sandBox', ['getCurrentUser', 'getGroupMessage']),
    ...mapGetters('layoutOption', ['getIsNarrowScreen']),
    sortedMemberList() {
      // 角色优先级映射
      const rolePriorityMap = new Map([
        ['super-admin', 0],
        ['lord', 1],
        ['admin', 2],
        ['member', 3]
      ]);
      // 获取权重值
      const getPriority = (role) => {
        return rolePriorityMap.has(role) ? rolePriorityMap.get(role) : 4;
      };
      // 排序
      const sortedMemberList = [...this.memberList].sort((a, b) => {
        return getPriority(a.role) - getPriority(b.role);
      });
      return sortedMemberList;
    },
    getGroupMemberLength() {
      return this.memberList.length;
    },
    isMuteAll() {
      return this.getGroupMessage(this.group.id).isMute;
    },
    muteBtnClass() {
      return this.isMuteAll ? 'el-icon-turn-off-microphone' : 'el-icon-microphone';
    },
    isShowMuteBtn() {
      const u = new User(this.getCurrentUser);
      return u._isAdmin(this.chatTarget.id);
    }
  },
  watch: {},
  created() {
    this.group = new Group({ id: this.chatTarget.id });
  },
  mounted() {
    // console.log(this.sortedMemberList);
  }
};
</script>

<style lang="scss" scoped>
.right-aside-wapper {
  z-index: 4;
  height: 100%;
  @media screen and (max-width: 528px) {
    position: absolute;
    right: 0;
  }
}

.aside-group {
  width: var(--sb-aside-width);
  background: #f2f2f2;
  border: 2px solid #e9e9e9;
  border-top: none;
  user-select: none;

  &::v-deep .pps-context-menu-area {
    width: 100%;
    padding: 8px;
  }
  &::v-deep .k-aside-inner {
    flex-grow: 1;
  }

  .member-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px;

    .btn-area {
      display: flex;
      // justify-content: space-between;
    }

    .icon-btn {
      width: 25px;
      height: 25px;
      font-weight: bold;
      margin: 0;
      background: rgb(255, 255, 255);

      & + .icon-btn {
        margin-left: 10px;
      }
    }

    .leave {
      color: rgb(247, 76, 108);
    }
  }
  .member-list {
    display: flex;
    flex-grow: 1;
    padding: 0;
    margin: 0;
    flex-direction: column;

    .member-item {
      display: flex;
      cursor: pointer;
      &:hover {
        background: var(--sb-reply-bg);
      }
    }
  }
  .user-item {
    display: flex;
    // flex-grow: 1;
    width: 100%;

    .user-name {
      margin-left: 5px;
      flex: 1;
      min-width: 0;
      // width: fit-content;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .user-role {
      // margin-left: auto;
      font-size: 11px;
      padding: 2px;
      line-height: 1rem;
      border-radius: 4px;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .admin {
      background: var(--sb-admin-bg);
      color: var(--sb-admin-color);
    }
    .lord {
      background: var(--sb-lord-bg);
      color: var(--sb-lord-color);
    }
    .super-admin {
      background: var(--sb-super-admin-bg);
      color: var(--sb-super-admin-color);
    }
  }
}

// 过渡
.v-enter,
.v-leave-to {
  width: 0;
  @media screen and (max-width: 768px) {
    right: -250px;
  }
}
.v-enter-active,
.v-leave-active {
  transition: 0.3s ease-in-out;
}
.v-enter-to,
.v-leave {
  width: var(--sb-aside-width);
  @media screen and (max-width: 768px) {
    right: 0px;
  }
}
</style>
