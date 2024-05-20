<template>
  <transition>
    <el-aside class="k-aside" v-show="!$store.state.isFoldAside">
      <div class="logo">
        <img src="@/assets/favicon.svg" alt="" />
      </div>
      <k-menu
        :default-active="$route.path"
        active-color="#752bec"
        text-color="#061e26"
        background-color="#00000017"
        mode="vertical"
        router
      >
        <k-menu-item
          v-for="(menuItem, index) in menus"
          :key="index"
          :index="menuItem.indexPath"
        >
          <i :class="menuItem.icon" />
          <!-- <p>{{ menuItem.content }}</p> -->
        </k-menu-item>
      </k-menu>
      <div class="empty"></div>
      <div class="quit">
        <el-popover trigger="hover" placement="right" v-model="visible">
          <div class="quitBtn" @click="quitFn">退出登录</div>
          <i class="el-icon-switch-button" slot="reference"></i>
        </el-popover>
      </div>
      <pps-dialog
        :show="isShowDialog"
        @confirmed="quitFn"
        @canceled="cancelFn"
        :content="dialogData"
      />
    </el-aside>
  </transition>
</template>

<script>
import { logoutAPI } from '@/api';
import { mapMutations } from 'vuex';
import kMenuItem from '@/components/menus/menu-item.vue';
import kMenu from '@/components/menus/';
export default {
  name: 'k-aside',
  components: { kMenuItem, kMenu },
  data() {
    return {
      visible: false,
      isShowDialog: false,
      dialogData: { title: '提示', message: '确认退出登录？' },
      menus: [
        { icon: 'el-icon-data-line', content: '数据中心', indexPath: '/dataCenter' },
        { icon: 'el-icon-price-tag', content: '实例管理', indexPath: '/bots' },
        { icon: 'el-icon-folder', content: '模块管理', indexPath: '/modules' },
        { icon: 'el-icon-setting', content: '配置查看', indexPath: '/config' },
        { icon: 'el-icon-receiving', content: '沙盒测试', indexPath: '/sendBox' },
        { icon: 'el-icon-cpu', content: '性能监控', indexPath: '/console' }
      ]
    };
  },
  methods: {
    ...mapMutations(['updateToken']),
    cancelFn() {
      this.isShowDialog = false;
    },
    quitFn() {
      this.$confirm(this.dialogData.message, this.dialogData.title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
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
  mounted() {
  }
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
  z-index: 1;
  .logo {
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
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
    .k-menu-item {
      width: 60px;
      height: 60px;
    }
  }
  .empty {
    flex-grow: 1;
  }
  .quit {
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
