<template>
  <transition>
    <el-aside class="k-aside" v-show="!$store.state.layoutOption.isFoldAside">
      <div class="logo">
        <img src="@/assets/favicon.svg" alt="" />
      </div>
      <k-menu
        :default-active="$route.path"
        active-color="#752bec"
        :active-shape="['line']"
        text-color="#061e26"
        background-color="#00000017"
        mode="column"
        :tips="true"
        router
      >
        <k-menu-item
          v-for="(menuItem, index) in menus"
          :key="index"
          :index="menuItem.indexPath"
          :title="menuItem.content"
          width="60"
          height="60"
        >
          <i :class="menuItem.icon" />
          <!-- <p>{{ menuItem.content }}</p> -->
        </k-menu-item>
      </k-menu>
      <div class="empty"></div>
      <el-tooltip effect="dark" content="退出登录" placement="right">
        <div class="quit">
          <i @click="quitFn" class="el-icon-switch-button" slot="reference"></i>
        </div>
      </el-tooltip>
    </el-aside>
  </transition>
</template>

<script>
import { logoutAPI } from '@/api';
import { mapMutations } from 'vuex';
import kAside from '@/components/layout/aside.vue';
import kMenuItem from '@/components/menus/menu-item.vue';
import kMenu from '@/components/menus/';

export default {
  name: 'k-aside',
  // eslint-disable-next-line vue/no-unused-components
  components: { kMenuItem, kMenu, kAside },
  data() {
    return {
      visible: false,
      isShowDialog: false,
      dialogData: { title: '提示', message: '确认退出登录？' },
      menus: [
        { icon: 'el-icon-pie-chart', content: '数据中心', indexPath: '/dataCenter' },
        { icon: 'el-icon-printer', content: '实例管理', indexPath: '/bots' },
        { icon: 'el-icon-files', content: '模块管理', indexPath: '/modules' },
        {
          icon: 'el-icon-shopping-bag-1',
          content: '模块中心',
          indexPath: '/modulesCenter'
        },
        { icon: 'el-icon-set-up', content: '指令管理', indexPath: '/command' },
        { icon: 'el-icon-setting', content: '配置查看', indexPath: '/config' },
        { icon: 'el-icon-chat-line-square', content: '沙盒测试', indexPath: '/sandBox' },
        { icon: 'el-icon-cpu', content: '控制台', indexPath: '/console' }
      ]
    };
  },
  methods: {
    ...mapMutations('layoutOption', ['updateToken']),
    cancelFn() {
      this.isShowDialog = false;
    },
    quitFn() {
      this.$dialog({ content: this.dialogData.message, title: this.dialogData.title })
        .then(() => {
          logoutAPI();
        })
        .then(() => {
          this.updateToken('');
          this.$router.push('/login');
        })
        .catch(() => {
          this.cancelFn();
        });
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.el-aside {
  display: flex;
  flex-direction: column;
  width: 60px !important;
  background: var(--bg-normal);
  user-select: none;
  box-shadow: 0 0 8px 0 var(--normal-shadow);
  overflow-x: hidden;
  z-index: 1;
  .logo {
    position: sticky;
    background: #fff;
    top: 0;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    z-index: 1;
  }
  img {
    max-width: 30px;
    cursor: pointer;
    transition: 0.1s linear;
  }
  .k-menu {
    margin-top: 10px;
    p {
      font-size: 13px;
    }
    i {
      font-size: 23px;
    }
  }
  .empty {
    height: 0;
    flex-grow: 1;
  }
  .quit {
    position: sticky;
    bottom: 0;
    background: #fff;
    width: 60px;
    height: 60px;
    line-height: 60px;
    font-size: 25px;
    text-align: center;
    box-sizing: border-box;
    cursor: pointer;

    &:hover {
      color: var(--theme-color);
    }
  }
  &::-webkit-scrollbar {
    width: 5px; // 设置滚动条的宽度
  }
  &::-webkit-scrollbar-track {
    background: transparent;
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    position: absolute;
    right: -5px;
    width: 5px;
    background: #88888870;
    border-radius: 6px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #888888; // 鼠标悬停时滚动条的颜色
  }
}
.v-enter,
.v-leave-to {
  width: 0 !important;
}
.v-enter-active,
.v-leave-active {
  transition: 0.2s ease-in-out;
}
.v-enter-to,
.v-leave {
  width: 60px;
}
</style>
