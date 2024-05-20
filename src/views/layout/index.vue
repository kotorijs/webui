<template>
  <el-container class="main-container">
    <k-aside></k-aside>
    <!-- <modulesPage></modulesPage> -->
    <el-container>
      <el-header height="40px">
        <pps-button @click.native="onFold()">
          <i class="el-icon-d-arrow-left"></i>
        </pps-button>
        <span class="title">{{ pathTitle }}</span>
        <pps-button @click="$store.commit('updateToken', '')">clear</pps-button>
      </el-header>
      <el-main :class="{ isPadding }"><router-view></router-view></el-main>
      <k-footer v-if="!isPadding"></k-footer>
    </el-container>
  </el-container>
</template>

<script>
import Ws from '@/utils/webSocket';
import kAside from './aside.vue';
import kFooter from './footer.vue';
// import modulesPage from '../modules/index.vue';
export default {
  name: 'myLayout',
  components: { kAside, kFooter },
  data() {
    return {
      statusData: {
        cpu: '20',
        ram: '20'
      }
    };
  },
  methods: {
    onFold() {
      this.$store.commit('updateIsFoldAside', !this.$store.state.isFoldAside);
    },
    handleAside() {
      if (this.$route.fullPath === '/console') {
        this.$store.commit('updateIsFoldAside', true);
      } else {
        this.$store.commit('updateIsFoldAside', false);
      }
    }
  },
  mounted() {
    console.log();
    this.handleAside();
    Ws.create();
  },
  computed: {
    pathTitle() {
      return this.$route.meta.title;
    },
    isPadding() {
      if (this.$route.fullPath === '/console') {
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
  .el-header {
    background-color: var(--bg-main);
    border-bottom: 2px solid #e1e2e8;
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;

    .title {
      color: var(--font-gray-color);
      font-size: 1.17em;
      font-weight: 600;
      margin-left: 20px;
      letter-spacing: 1px;
    }
  }
  .el-main {
    padding-top: 0;
    padding-bottom: 0;
    overflow-y: scroll;
    height: 0;
    background-color: var(--normal-color);
    // background-color: #f2f2f2;
  }
  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
/* .el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
} */
</style>
