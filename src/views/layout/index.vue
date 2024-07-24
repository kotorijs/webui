<template>
  <el-container class="main-container">
    <k-aside></k-aside>
    <el-container direction="vertical">
      <k-header></k-header>
      <el-main :class="{ isPadding }">
        <router-view></router-view>
      </el-main>
      <k-footer v-if="!isPadding"></k-footer>
    </el-container>
  </el-container>
</template>

<script>
import Ws from '@/utils/webSocket';
import kAside from './aside.vue';
import kFooter from './footer.vue';
import kHeader from './header.vue';
const uniqueRoutes = [];
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
      if (this.$route.fullPath === uniqueRoutes[0]) {
        return true;
      }
      return false;
    }
  }
};
</script>

<style lang="less" scoped>
.isPadding {
  padding-left: 8px !important;
  padding-right: 8px !important;
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
