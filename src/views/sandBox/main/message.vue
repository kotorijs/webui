<template>
  <div class="k-sb-message" :class="{ 'k-sb-message-self': isSelf }">
    <div class="message">
      <!-- 头像 -->
      <pps-context-menu @select="avatarContextMenuFn" :menus="getUserMenuItems()">
        <div style="width: 36px" slot="content">
          <pps-avatar
            size="36"
            @click="viewUserProfile()"
            :src="getUserAvatarFn(message.role)"
            style="user-select: none"
          ></pps-avatar>
        </div>
      </pps-context-menu>
      <!-- 气泡 -->
      <div class="container">
        <div class="nickname_wrapper">
          <span v-if="chatTarget.isGroup" :class="getGroupSenderRole.role" class="groupRole">
            {{ getRole }}
          </span>
          <span class="nickname">{{ getUserNickname }}</span>
          <span class="date" v-trans-time="message.date"></span>
        </div>
        <pps-context-menu @select="testContextMenuFn" :menus="getTextMenus">
          <div class="content" slot="content">
            <pre>{{ message.content || '\u00A0' }}</pre>
          </div>
        </pps-context-menu>
        <div v-if="message.replyMsg?.name" class="reply">
          {{ message.replyMsg.name }}：{{ message.replyMsg.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tranRoleMixin } from '@/mixin/index';
import { getVisibleMenuItems } from '@/utils/sandBox/permissionService';
import Administrators from '@/utils/sandBox/administrators';
import User from '@/utils/sandBox/user';
import Group from '@/utils/sandBox/group';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'k-sb-message',
  data() {
    return {
      admin: new Administrators()
    };
  },
  mixins: [tranRoleMixin],
  props: {
    message: {
      type: Object,
      default() {
        return {};
      }
    },
    isSelf: {
      type: Boolean,
      default: false
    },
    avatar: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapActions('sandBox', ['send']),
    getUserAvatarFn(role) {
      if (role === 'self') {
        return this.getCurrentUser.avatar;
      } else if (role === 'friend') {
        return this.admin.getUserById(this.message.sender).avatar;
      } else {
        return this.admin.getUserById(this.message.role).avatar;
      }
    },
    deleteMsgFn(user) {
      if (this.message.isGroup) {
        // 群聊
        const res = user.deleteGroupMessage({ id: this.chatTarget.id, msgId: this.message.id });
        if (res) {
          this.$message.success('删除成功');
          this.send({
            event: 'on_message_delete',
            time: Date.now(),
            type: 1,
            userId: user.id,
            messageId: this.message.id,
            operatorId: user.id,
            groupId: this.chatTarget.id
          });
        } else this.$message.error('删除失败！');
      } else {
        // 私聊
        console.log(this.message.receiver, this.message.id);
        const res = user.deleteFriendMessage(this.message.receiver, this.message.id);
        if (res) {
          this.$message.success('删除成功');
          this.send({
            event: 'on_message_delete',
            time: Date.now(),
            type: 0,
            userId: user.id,
            messageId: this.message.id
          });
        } else this.$message.error('删除失败！');
      }
    },
    testContextMenuFn({ task }) {
      const user = new User(this.getCurrentUser);
      if (task === 0) {
        // 撤回
        this.deleteMsgFn(user);
      } else if (task === 1) {
        // 回复
        this.$emit('replyMsg', this.message);
      }
    },
    getUserMenuItems() {
      if (this.chatTarget.isGroup) {
        const curUer = this.memberList.find(({ id }) => id === this.getCurrentUser.id);
        const targetUser = this.memberList.find(({ id }) => id === this.message.role);
        const group = new Group({ id: this.chatTarget.id });
        return getVisibleMenuItems(curUer, targetUser, group);
      }
      return [];
    },
    viewUserProfile() {
      const targetUser = this.admin.getUserById(this.message.role);
      this.$emit('handleMenuAction', {
        targetUser,
        actionType: 'VIEW_PROFILE'
      });
    }
  },
  computed: {
    ...mapGetters('sandBox', ['getCurrentUser', 'getCurrentMsg']),
    getUserNickname() {
      let nickname;
      if (this.message.role === 'self') {
        nickname = this.getCurrentUser.name;
      } else if (this.message.role === 'friend') {
        nickname = this.admin.getUserById(this.message.sender).name;
      } else {
        nickname = this.admin.getUserById(this.message.role).name;
      }
      return nickname || 'u3';
    },
    getTextMenus() {
      if (this.isSelf) {
        return [
          { label: '回复消息', task: 1 },
          { label: '删除消息', task: 0 }
        ];
      } else {
        return [{ label: '回复消息', task: 1 }];
      }
    },
    getGroupSenderRole() {
      const fail = { role: 'expellee', id: '未知' };
      if (this.chatTarget.isGroup) {
        const role = this.memberList.find(({ id }) => id === this.message.role);
        return role || fail;
      }
      return fail;
    },
    getRole() {
      return this.tranRoleFn(this.getGroupSenderRole.role);
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.k-sb-message {
  display: flex;
  padding: 10px 10px;
  box-sizing: border-box;
  &::selection {
    background: var(--theme-hover-color);
  }
  .message {
    display: flex;
    flex-direction: row;
    width: 75%;
    gap: 8px;

    .container {
      width: calc(100% - 44px);
      .nickname_wrapper {
        color: #7a7a7a;
        user-select: none;
        display: flex;
        align-items: center;
        flex-direction: row;
        gap: 5px;

        span {
          display: inline-flex;
          align-items: flex-end;
          height: 1.2em;
          white-space: nowrap;
        }
        .nickname {
          font-size: 12px;
          // color: #000;
          font-weight: bold;
        }
        .date {
          font-size: 11px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .groupRole {
          font-size: 11px;
          padding: 2px;
          line-height: 1.2em;
          border-radius: 4px;
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
        .expellee {
          background: var(--sb-reply-bg);
          color: var(--sb-reply-color);
        }
      }
      .pps-context-menu-area {
        width: 100%;
      }
      .content {
        max-width: fit-content;
        width: 100%;
        flex-shrink: 1;
        background: #fff;
        padding: 8px;
        border-radius: 8px;
        margin-top: 4px;

        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      }
      .reply {
        font-size: 12px;
        border-radius: 4px;
        padding: 6px 8px;
        margin-top: 6px;
        background: var(--sb-reply-bg);
        color: var(--sb-reply-color);
        user-select: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    & + .k-sb-message {
      margin-top: 8px;
    }
  }
}
.k-sb-message-self {
  justify-content: flex-end;
  .message {
    flex-direction: row-reverse;

    .container {
      .nickname_wrapper {
        text-align: end;
        flex-direction: row-reverse;
      }
      .content {
        color: #fff;
        background: var(--theme-color);
        margin-left: auto;
      }
    }
  }
}
</style>
