<template>
  <el-container class="main-container">
    <k-aside></k-aside>
    <el-container direction="vertical">
      <k-header></k-header>
      <el-main :class="{ isPadding }" v-resize-ob="resizeFn">
        <router-view></router-view>
      </el-main>
      <k-footer v-if="isFooter"></k-footer>
    </el-container>
  </el-container>
</template>

<script>
import Ws from '@/utils/webSocket';
import kAside from './aside.vue';
import kFooter from './footer.vue';
import kHeader from './header.vue';
const uniqueRoutes = ['/console', '/sendBox'];
export default {
  name: 'myLayout',
  components: { kAside, kFooter, kHeader },
  data() {
    return {
      ws: null
    };
  },
  methods: {
    handleAside() {
      if (uniqueRoutes.includes(this.$route.fullPath)) {
        this.$store.commit('layoutOption/updateIsFoldAside', true);
      } else {
        this.$store.commit('layoutOption/updateIsFoldAside', false);
      }
    },
    resizeFn(w, h) {
      if (Math.floor(w) <= 400) {
        console.log(Math.floor(w), Math.floor(h));
      }
    }
  },
  mounted() {
    this.handleAside();
    this.ws = new Ws();
  },
  beforeDestroy() {
    console.log('beforeDestroy');
    this.ws.server.close();
  },
  updated() {
    this.handleAside();
  },
  computed: {
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
    height: 0;
    background-color: var(--normal-color);
  }
}
</style>
