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
// import User from '@/utils/sendBox/User';
import Administrators from '@/utils/sendBox';
import kContainer from '@/components/layout/container';
import kSbAside from '@/components/layout/aside';
export default {
  name: 'sendBox',
  components: { kContainer, kSbAside },
  data() {
    return {
      show: {
        isShowUsers: true,
        isShowGroups: true
      }
    };
  },
  methods: {},
  mounted() {
    const admin = new Administrators();
    this.$store.commit('sendBox/CLEAR_USERS');
    this.$store.commit('sendBox/CLEAR_GROUPS');
    const jack = admin.createUser({ id: 1, name: 'jack', age: 18, sex: '男' });
    const tom = admin.createUser({ id: 2, name: 'tom', age: 28, sex: '男' });
    const lucy = admin.createUser({ id: 3, name: 'lucy', age: 17, sex: '女' });
    console.log('获取所有用户', admin.getAllUser());
    admin.createGroup({ id: 1, name: 'group1', members: [1, 2, 3], lord: 1 });
    admin.createGroup({ id: 2, name: 'group2', members: [jack, tom], lord: 2 });
    admin.createGroup({ id: 3, name: 'group3', members: [1, 2, lucy], lord: 3 });
    console.log('获取所有群组', admin.getAllGroup());
    admin.removeUserById(1);
    console.log('获取所有用户', admin.getAllUser());
    console.log('获取用户1', admin.getUserById(1));
    admin.removeGroupById(1);
    console.log('获取群组1', admin.getGroupById(1));
    console.log('获取群组3', lucy.getGroupById(3));
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
