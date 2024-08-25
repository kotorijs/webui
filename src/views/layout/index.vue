<template>
  <el-container class="main-container">
    <k-aside></k-aside>
    <el-container direction="vertical">
      <k-header></k-header>
      <el-main :class="{ isPadding }" v-resize-ob="resizeFn">
        <keep-alive include="kConsole">
          <router-view></router-view>
        </keep-alive>
      </el-main>
      <k-footer v-if="isFooter"></k-footer>
    </el-container>
  </el-container>
</template>

<script>
import Ws from '@/utils/webSocket';
import { mapGetters } from 'vuex';
import kAside from './aside.vue';
import kFooter from './footer.vue';
import kHeader from './header.vue';
const uniqueRoutes = ['/console', '/sandBox'];
export default {
  name: 'myLayout',
  components: { kAside, kFooter, kHeader },
  data() {
    return {
      ws: null,
      isSmall: false
    };
  },
  provide() {
    return {
      layout: this
    };
  },
  methods: {
    handleAside() {
      console.log('handleAside', this.isSmall);
      if (uniqueRoutes.includes(this.$route.fullPath) || this.isSmall) {
        this.$store.commit('layoutOption/updateIsFoldAside', true);
      } else {
        this.$store.commit('layoutOption/updateIsFoldAside', false);
      }
    },
    resizeFn(w, h) {
      // console.log(Math.floor(w));
      if (Math.floor(w) <= 428) {
        this.isSmall = true;
      } else {
        this.isSmall = false;
      }
    }
  },
  mounted() {
    this.handleAside();
    this.ws = new Ws();
    this.$store.dispatch('command/getCommands');
    this.$store.dispatch('modulesDetail/getData');
  },
  beforeDestroy() {
    console.log('beforeDestroy');
    this.ws.server.close();
  },
  updated() {
    this.handleAside();
    console.log('updated');
  },
  computed: {
    ...mapGetters('layoutOption', ['getIsFoldAside']),
    isPadding() {
      if (uniqueRoutes.includes(this.$route.fullPath)) {
        return true;
      }
      return false;
    },
    isFooter() {
      if (uniqueRoutes[0].includes(this.$route.fullPath)) {
        return false;
      }
      return true;
    }
  }
};
</script>

<style lang="less" scoped>
.isPadding {
  // padding-left: 0 !important;
  // padding-right: 0 !important
  padding: 0 !important;
}
.main-container {
  height: 100%;
  .el-main {
    padding-top: 0;
    padding-bottom: 0;
    overflow-x: hidden;
    height: var(--k-main-height);
    background-color: var(--normal-color);
    &::-webkit-scrollbar {
      width: 5px; // 设置滚动条的宽度
      height: 5px;
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
}
</style>
