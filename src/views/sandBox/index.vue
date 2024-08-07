<template>
  <k-container direction="horizontal">
    <!-- 好友、群聊列表 -->
    <k-sb-aside class="aside-users empty">
      <header class="k-chat-header"></header>
    </k-sb-aside>

    <k-container direction="vertical" style="width: 100%">
      <!-- 聊天窗口页头 -->
      <header class="k-chat-header"></header>

      <k-container direction="horizontal">
        <div class="k-chat-main chat-empty">
          <!-- 聊天内容 -->
          <div class="k-chat-box"></div>

          <!-- 输入框 -->
          <div class="k-chat-input"></div>
        </div>

        <!-- 右侧、群聊成员 -->
        <k-sb-aside v-show="show.isShowGroups" class="aside-group" style="background: green">
          aside-right
        </k-sb-aside>
      </k-container>
    </k-container>
  </k-container>
</template>

<script>
import User from '@/utils/sandBox/user';
import Administrators from '@/utils/sandBox/administrators';
import kContainer from '@/components/layout/container';
import kSbAside from '@/components/layout/aside';
export default {
  name: 'sandBox',
  components: { kContainer, kSbAside },
  data() {
    return {
      show: {
        isShowUsers: true,
        isShowGroups: true
      },
      admin: null
    };
  },
  methods: {},
  mounted() {
    const admin = new Administrators();
    // this.$store.commit('sandBox/CLEAR_USERS'); // 清空用户
    // this.$store.commit('sandBox/CLEAR_GROUPS'); // 清空群组
    const jack = admin.createUser({ id: 1, name: 'jack', age: 18, sex: '男' });
    const tom = admin.createUser({ id: 2, name: 'tom', age: 28, sex: '男' });
    const lucy = admin.createUser({ id: 3, name: 'lucy', age: 17, sex: '女' });
    const mary = new User({ id: 4, name: 'mary', age: 19, sex: '女' });
    const someone = new User({ id: '21022102cz', name: '只陌予', age: 22, sex: '女' });
    admin.createGroup({ id: 11, name: 'group1', members: [1, 2, 3, 4], lord: 1 });
    admin.createGroup({ id: 22, name: 'group2', members: [3, jack, tom], lord: 2 });
    admin.createGroup({ id: 33, name: 'group3', members: [1, 2, lucy, someone], lord: 3 });
    if (mary.addFriend(2)) console.log('mary添加tom成功');
    if (jack.addFriend(3)) console.log('jack添加tom成功');
    // lucy.removeGroupById(33);
    // jack.addGroupById({ groupId: 33 });
    // lucy.leaveGroupById(22);
    // console.log(admin.getAllUser());
    // lucy.kickMemberById({ groupId: 11, expellee: 1 });
    // mary.leaveGroupById(22);
    // jack.sendMessageToFriend({ id: 3, content: '你好' });
    // lucy.sendMessageToFriend({ id: 1, content: 'hi' });
    // jack.removeFriendById(3);
    lucy.inviteUserToGroup({ groupId: 33, invitee: 4, role: 'admin' });
    mary.sendMessageToGroup({ id: 33, content: '大家好！我是mary' });
    // lucy.deleteGroupMessage({ id: 33, msgId: 'DoRpJ4CDs2LiZlWZVylFG' });
    // mary.unmuteMemberById(33, 2);
    // mary.handleMuteGroupById(33, false)
    // tom.sendMessageToGroup({ id: 33, content: '大家好！我是tom' });
  }
};
</script>

<style lang="less">
.k-container {
}
.k-chat-main {
  display: flex;
  flex-direction: column;
  background: gray;
  width: 100%;

  .k-chat-box {
    height: 100%;
  }

  .k-chat-input {
    height: 200px;
    background: #000;
  }
}
.k-chat-header {
  height: 60px;
  background: #ffff004e;
}
.empty {
  height: calc(var(--k-main-height) - var(--k-footer-height));
}
.chat-empty {
  height: calc(var(--k-main-height) - var(--k-footer-height) - 60px);
}
@media screen and (max-width: 1000px) {
  .aside-group {
    display: none;
  }
}
.aside-group,
.aside-users {
  transition: all 0.3s ease;
}
</style>
