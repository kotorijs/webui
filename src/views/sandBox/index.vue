<template>
  <k-container v-loading="0" direction="horizontal" class="k-sb-container">
    <!-- 好友、群聊列表 -->
    <sb-left-aside
      ref="leftAsideRef"
      :updateChatTarget="updateChatTargetFn"
      :updateCollapseMsg="updateCollapseMsgFn"
      @switchMsg="switchMsgCallback"
      @handleMenuAction="handleMenuAction"
    ></sb-left-aside>
    <k-container v-show="show.isShowChatBox" direction="vertical" class="k-sb-main">
      <!-- 聊天窗口页头 -->
      <header class="k-chat-header" v-show="show.isShowChatBox">
        <gray-button
          class="icon-btn"
          @click.native="collapseMsghandler()"
          v-show="!show.isCollapseMsg"
        >
          <el-tooltip effect="dark" content="展开消息列表" placement="right">
            <pps-icon icon="pps-icon-side-hide"></pps-icon>
          </el-tooltip>
        </gray-button>
        <div class="k-chat-header-content">
          <h1 class="k-chat-header-title">{{ chatTarget.name }}{{ getGroupMemberLength }}</h1>
        </div>
        <gray-button
          @click.native="collapseRighthandler()"
          v-show="chatTarget.isGroup"
          class="showGroupInfo"
        >
          <i class="el-icon-more"></i>
        </gray-button>
      </header>
      <!-- 聊天窗口 -->
      <k-container direction="horizontal" class="k-chat-main">
        <sb-chat-main
          ref="chatMainRef"
          :chatTarget="chatTarget"
          :memberList="getMemberList"
          @handleMenuAction="handleMenuAction"
        ></sb-chat-main>
        <!-- 右侧、群聊成员 -->
        <sb-right-aside
          v-if="chatTarget.isGroup"
          v-show="show.isCollapseRight"
          :chatTarget="chatTarget"
          :memberList="getMemberList"
          @handleMenuAction="handleMenuAction"
        ></sb-right-aside>
        <!-- 遮罩层 -->
        <div
          v-if="chatTarget.isGroup"
          v-show="isShowRightMask"
          @click="collapseRighthandler()"
          class="mask"
        ></div>
      </k-container>
    </k-container>
  </k-container>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import User from '@/utils/sandBox/user';
import Administrators from '@/utils/sandBox/administrators';
import Group from '@/utils/sandBox/group';
import kContainer from '@/components/layout/container';
import sbLeftAside from './aside/left.vue';
import sbRightAside from './aside/right.vue';
import sbChatMain from './main/chat.vue';
import grayButton from './ui/grayButton.vue';
import wsBus from '@/utils/sandBox/wsBus';
export default {
  name: 'sandBox',
  components: { kContainer, sbLeftAside, sbRightAside, sbChatMain, grayButton },
  data() {
    return {
      show: {
        isShowUsers: true,
        isShowGroups: true,
        isShowChatBox: true,
        isCollapseMsg: true,
        isCollapseRight: true
      },
      screen: { width: 0, height: 0 },
      admin: new Administrators(),
      chatTarget: {
        id: '',
        isGroup: false,
        name: ''
      }
    };
  },
  methods: {
    ...mapActions('sandBox', ['initWebSocket', 'send', 'close']),
    test() {
      const admin = new Administrators();
      // this.$store.commit('sandBox/CLEAR_USERS'); // 清空用户
      // this.$store.commit('sandBox/CLEAR_GROUPS'); // 清空群组
      const jack = admin.createUser({ id: 1, name: 'jack', age: 18, sex: '男' });
      const tom = admin.createUser({ id: 2, name: 'tom', age: 28, sex: '男' });
      const lucy = admin.createUser({ id: 3, name: 'lucy', age: 17, sex: '女' });
      const mary = new User({ id: 4, name: 'mary', age: 19, sex: '女' });
      const someone = new User({ id: '21022102cz', name: '只陌予', age: 22, sex: '女' });
      admin.createGroup({
        id: 11,
        name: 'group1',
        members: ['user-1', 'user-2', 'user-3', 'user-4'],
        lord: 'user-1'
      });
      admin.createGroup({ id: 22, name: 'group2', members: ['user-3', jack, tom], lord: 'user-2' });
      admin.createGroup({
        id: 33,
        name: 'group3',
        members: ['user-1', 'user-2', lucy, someone],
        lord: 'user-3'
      });
      if (mary.addFriend('user-2')) console.log('mary添加tom成功');
      if (jack.addFriend('user-3')) console.log('jack添加tom成功');
      mary.addFriend('user-1');
      tom.addFriend('user-1');
      // lucy.removeGroupById(33);
      // jack.addGroupById({ groupId: 33 });
      // lucy.leaveGroupById(22);
      // console.log(admin.getAllUser());
      // lucy.kickMemberById({ groupId: 11, expellee: 1 });
      // mary.leaveGroupById(22);
      jack.sendMessageToFriend({ id: 'user-2', content: '你好' });
      jack.sendMessageToFriend({ id: 'user-3', content: '你好' });
      jack.sendMessageToFriend({ id: 'user-4', content: '你好' });
      // admin.removeUserById('user-1');
      // lucy.sendMessageToFriend({ id: 1, content: 'hi' });
      // jack.removeFriendById(3);
      lucy.inviteUserToGroup({ groupId: 'group-33', invitee: 'user-4', role: 'admin' });
      // lucy.deleteGroupMessage({ id: 33, msgId: 'DoRpJ4CDs2LiZlWZVylFG' });
      // mary.unmuteMemberById(33, 2);
      // mary.handleMuteGroupById(33, false)
      // tom.sendMessageToGroup({ id: 'group-33', content: '大家好！我是tom' });
      // jack.sendMessageToGroup({ id: 'group-33', content: '大家好！我是jack' });
      // mary.sendMessageToGroup({ id: 'group-33', content: '大家好！我是mary' });
      // admin.removeGroupById('group-33');
      // console.log(this.$store.getters['sandBox/getCurrentUser']);
      // this.$store.commit('sandBox/SWITCH_USER', 'user-4')
    },
    createUser({ id, name, age, sex }) {
      // eslint-disable-next-line no-new
      new User({ id, name, age, sex });
    },
    collapseMsghandler() {
      this.$refs.leftAsideRef.collapseMsghandler(true);
      this.show.isCollapseRight = false;
    },
    collapseRighthandler() {
      this.show.isCollapseRight = !this.show.isCollapseRight;
    },
    updateChatTargetFn(id, isGroup, name) {
      // console.log('chage', id, isGroup);
      this.chatTarget.id = id;
      this.chatTarget.isGroup = isGroup;
      this.chatTarget.name = name;
    },
    updateCollapseMsgFn(state) {
      this.show.isCollapseMsg = state;
    },
    switchMsgCallback(params) {
      // console.log(params);
    },
    handleMenuAction(action) {
      const { actionType, currentUser, targetUser, groupId } = action;
      const actionMap = {
        VIEW_PROFILE: this.viewUserProfile,
        ADD_FRIEND: this.addFriend,
        REMOVE_FRIEND: this.removeFriend,
        AT_USER: this.mentionUser,
        REMOVE_USER: this.kickMember,
        MUTE_USER: this.muteMember,
        UNMUTE_USER: this.unmuteMember,
        REVOKE_ADMIN: this.revokeAdmin,
        SET_ADMIN: this.setAdmin,
        MUTE_GROUP: this.handleMuteGroup,
        REMOVE_GROUP: this.removeGroup,
        LEAVE_GROUP: this.leaveGroup,
        INVITE_FRIEND: this.inviteFriend
      };
      if (actionMap[actionType]) {
        actionMap[actionType](targetUser, groupId, currentUser);
      }
    },
    viewUserProfile(targetUser, groupId, currentUser) {
      this.$refs.leftAsideRef.showUserDetailFn(targetUser);
    },
    mentionUser(targetUser, groupId, currentUser) {
      if (this.messagingEnabled) this.$refs.chatMainRef.mentionMember(targetUser.name);
      else this.$message.info('禁言中，请解禁后再试！');
    },
    addFriend(targetUser, groupId, currentUser) {
      const user = new User(this.getCurrentUser);
      const res = user.addFriend(targetUser.id);
      if (res) {
        this.$message.success('添加成功！');
        this.send({
          event: 'on_friend_increase',
          time: Date.now(),
          type: 0,
          userId: user.id
        });
      } else this.$message.error('添加失败！');
    },
    removeFriend(targetUser, groupId, currentUser) {
      const user = new User(this.getCurrentUser);
      const res = user.removeFriendById(targetUser.id);
      if (res) {
        this.send({
          event: 'on_friend_decrease',
          time: Date.now(),
          type: 0,
          userId: user.id
        });
      }
    },
    removeGroup(targetUser, groupId, currentUser) {
      const user = new User(targetUser);
      const res = user.removeGroupById(groupId);
      if (!res) {
        this.$dialog({ title: '警告', content: '群聊删除失败！' });
      }
    },
    leaveGroup(targetUser, groupId, currentUser) {
      const user = new User(targetUser);
      const res = user.leaveGroupById(groupId);
      if (!res) {
        this.$message.error('群聊退出失败！');
      } else {
        this.$message.success('已退出群聊！');
        this.send({
          event: 'on_group_decrease',
          time: Date.now(),
          type: 1,
          userId: targetUser.id,
          operatorId: targetUser.id,
          groupId
        });
      }
    },
    inviteFriend(targetUser, groupId, currentUser) {
      const curUser = new User(this.getCurrentUser);
      const res = curUser.inviteUserToGroup({
        groupId,
        invitee: targetUser.id
      });
      if (res) {
        this.send({
          event: 'on_group_increase',
          time: Date.now(),
          type: 1,
          userId: targetUser.id,
          operatorId: curUser.id,
          groupId
        });
      } else {
        this.$message.error('邀请失败！');
      }
    },
    muteMember(targetUser, groupId, duration) {
      if (duration === 0) return this.unmuteMember(targetUser, groupId);
      const user = new User(this.getCurrentUser);
      const res = user.muteMemberById(groupId, targetUser.id, duration);
      if (res) {
        this.send({
          event: 'on_group_ban',
          userId: targetUser.id,
          operatorId: user.id,
          groupId,
          duration
        });
      } else {
        this.botSendGroupMsg({ groupId, message: '管理员无法禁言！' });
      }
    },
    unmuteMember(targetUser, groupId, currentUser) {
      const user = new User(this.getCurrentUser);
      const res = user.unmuteMemberById(groupId, targetUser.id);
      if (res) {
        this.send({
          event: 'on_group_ban',
          userId: targetUser.id,
          operatorId: user.id,
          groupId,
          duration: 0
        });
      }
    },
    handleMuteGroup(action, groupId, status) {
      console.log(action, groupId, status);
      const isMute = action ?? status;
      const user = new User(this.getCurrentUser);
      const res = user.handleMuteGroupById(groupId, isMute);
      if (res) {
        this.send({
          event: 'on_group_whole_ban',
          type: 1,
          operatorId: user.id,
          operation: status ? 'set' : 'unset',
          groupId,
          time: Date.now()
        });
      }
    },
    kickMember(targetUser, groupId, currentUser) {
      const user = new User(this.getCurrentUser);
      const res = user.kickMemberById({ groupId, expellee: targetUser.id });
      if (res) {
        this.$message.success('已移出群聊！');
        this.send({
          event: 'on_group_decrease',
          time: Date.now(),
          type: 1,
          userId: targetUser.id,
          operatorId: user.id,
          groupId
        });
      } else {
        this.$message.error('移除失败！');
      }
    },
    setAdmin(targetUser, groupId, currentUser) {
      const res = new User(this.getCurrentUser).setGroupAdmin({
        gid: groupId,
        mid: targetUser.id
      });
      if (res) {
        this.send({
          event: 'on_group_admin',
          time: Date.now(),
          type: 1,
          userId: targetUser.id,
          operation: 'set',
          groupId
        });
      }
    },
    revokeAdmin(targetUser, groupId, currentUser) {
      const res = new User(this.getCurrentUser).revokeGroupAdmin(groupId, targetUser.id);
      if (res) {
        this.send({
          event: 'on_group_admin',
          time: Date.now(),
          type: 1,
          userId: targetUser.id,
          operation: 'unset',
          groupId
        });
      }
    },
    receiveWsMsg(msg) {
      const actionsMap = {
        send_private_msg: this.botSendPrivateMsg,
        send_group_msg: this.botSendGroupMsg,
        on_data_error: this.t
      };

      if (actionsMap[msg.action]) {
        actionsMap[msg.action](msg);
      } else if (msg.action === 'set_group_whole_ban') {
        this.handleMuteGroup(msg.enable, msg.groupId);
      } else if (msg.action === 'set_group_ban') {
        console.log(msg.userId);
        const user = new User({ id: msg.userId });
        this.muteMember(user, msg.groupId, msg.time);
      }
    },
    t(d) {
      // const t = JSON.parse(d.error);
      // console.log(t);
    },
    botSendPrivateMsg(msg) {
      const user = new User({ numId: 'super-admin' });
      user.sendMessageToFriend({
        id: msg.userId,
        content: msg.message,
        replyMsg: null
      });
    },
    botSendGroupMsg(msg) {
      const user = new User({ numId: 'super-admin' });
      user.sendMessageToGroup({
        id: msg.groupId,
        content: msg.message,
        replyMsg: null
      });
    },

    // 控制ws是否长链
    initSandboxWsAliveFn() {
      if (!this.isKeepSandboxWsAlive) {
        this.close();
      }
    }
  },
  computed: {
    ...mapGetters('sandBox', ['getCurrentUser', 'getCurrentMsg']),
    ...mapGetters('layoutOption', ['getIsNarrowScreen']),
    ...mapState('sandBox', ['isKeepSandboxWsAlive']),
    getMemberList() {
      if (this.chatTarget.isGroup && this.getCurrentMsg) {
        const group = this.admin.getGroupById(this.chatTarget.id);
        return group ? new Group({ id: group.id }).getAllMember() : [];
      }
      return [];
    },
    getGroupMemberLength() {
      return this.chatTarget.isGroup ? `（${this.getMemberList.length}）` : null;
    },
    messagingEnabled() {
      if (this.chatTarget.isGroup) {
        const curMember = new User(this.getCurrentUser);
        const isAdmin = curMember._isAdmin(this.chatTarget.id);
        if (isAdmin) return true;
        const isGroupMute = this.getCurrentMsg.isMute;
        const isMute = this.getCurrentMsg.muteMembers.includes(curMember.id);
        return !(isGroupMute || isMute);
      }
      return true;
    },
    isShowRightMask() {
      return this.getIsNarrowScreen && this.show.isCollapseRight;
    },
    isShowRightAside() {
      return this.show.isCollapseRight;
    }
  },
  watch: {
    getIsNarrowScreen: {
      handler(val) {
        if (val) {
          this.show.isCollapseRight = false;
        } else {
          this.show.isCollapseRight = true;
        }
      },
      immediate: true
    },
    getCurrentMsg: {
      handler(val) {
        if (val === null) {
          this.chatTarget = { id: '', isGroup: false };
        }
      },
      deep: true
    }
  },
  created() {
    this.$store.commit('sandBox/SWITCH_USER');
    this.$store.commit('sandBox/SWITCH_CHAT');

    // 初始化ws连接
    this.initWebSocket();
    wsBus.$on('onmessage', this.receiveWsMsg);
  },
  mounted() {
    // this.show.isCollapseRight = !this.getIsNarrowScreen;
  },
  beforeDestroy() {
    wsBus.$off('onmessage', this.receiveWsMsg);
    this.initSandboxWsAliveFn();
  }
};
</script>

<style lang="scss" scoped>
.k-container ::v-deep aside,
.k-container ::v-deep section,
.k-container ::v-deep header,
.k-container ::v-deep div {
  box-sizing: border-box;
}
.k-sb-container {
  --sb-header-height: 60px;
  .k-sb-main {
    // height: 100%;
    flex: 1;
    min-width: 0;
    .k-chat-main {
      position: relative;
      flex-grow: 1;
      min-width: 0;

      .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        opacity: 0.5;
        z-index: 3;
      }
    }
  }
}
.k-sb-container ::v-deep .k-chat-header {
  height: var(--sb-header-height);
}
.k-chat-header {
  display: flex;
  align-items: center;
  border-bottom: 2px solid #e9e9e9;
  background-color: #f2f2f2;

  .icon-btn {
    margin-left: 10px;
  }
  .showGroupInfo {
    margin-left: auto;
    margin-right: 10px;
  }
}
.k-chat-header-content {
  margin-inline-start: 10px;
  .k-chat-header-title {
    font-size: 16px;
    font-style: normal;
  }
}
.aside-group,
.aside-users {
  transition: all 0.3s ease;
}
</style>
