<template>
  <k-container class="k-container" direction="horizontal">
    <!-- 好友、群聊列表 -->
    <sb-left-aside></sb-left-aside>
    <k-container direction="vertical" style="width: 100%">
      <!-- 聊天窗口页头 -->
      <header class="k-chat-header"></header>
      <k-container direction="horizontal">
        <sb-chat-main></sb-chat-main>
        <button @click="click">点击</button>
        <!-- 右侧、群聊成员 -->
        <sb-right-aside v-show="show.isShowGroups"></sb-right-aside>
      </k-container>
    </k-container>
  </k-container>
</template>

<script>
import { mapGetters } from 'vuex';
import User from '@/utils/sandBox/user';
import Administrators from '@/utils/sandBox/administrators';
import kContainer from '@/components/layout/container';
import sbLeftAside from './aside/left.vue';
import sbRightAside from './aside/right.vue';
import sbChatMain from './main/chat.vue';
export default {
  name: 'sandBox',
  components: { kContainer, sbLeftAside, sbRightAside, sbChatMain },
  data() {
    return {
      show: {
        isShowUsers: true,
        isShowGroups: true
      },
      admin: null
    };
  },
  methods: {
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
    click() {
      // eslint-disable-next-line no-undef
      // const dropper = new EyeDropper();
      // const result = await dropper.open();
      // console.log(result);
      for (let i = 0; i < 15; i++) {
        this.createUser({ id: i, name: `test${i}`, age: `1${i}`, sex: '男' });
      }
    }
  },
  computed: {
    ...mapGetters('sandBox', ['getCurrentUser'])
  },
  mounted() {
    this.$store.commit('sandBox/SWITCH_USER');
  }
};
</script>

<style lang="less" scoped>
.k-container ::v-deep aside,
.k-container ::v-deep section,
.k-container ::v-deep header,
.k-container ::v-deep div {
  box-sizing: border-box;
}
.k-container ::v-deep .k-chat-header {
  height: 60px;
}
.k-chat-header {
  border-bottom: 2px solid #e9e9e9;
  background-color: #f2f2f2;
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
