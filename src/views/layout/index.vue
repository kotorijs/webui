<template>
  <el-container class="main-container" v-resize-ob="resizeFn">
    <k-aside></k-aside>
    <el-container direction="vertical">
      <k-header></k-header>
      <el-main :class="{ isPadding, lessPadding: isSmall }">
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
import { version } from '@/../package.json';
import { getVersionAPI } from '@/api';
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
      if (uniqueRoutes.includes(this.$route.fullPath) || this.isSmall) {
        this.$store.commit('layoutOption/updateIsFoldAside', true);
      } else {
        this.$store.commit('layoutOption/updateIsFoldAside', false);
      }
    },
    resizeFn(w, h) {
      if (Math.floor(w) <= 428) {
        this.isSmall = true;
      } else {
        this.isSmall = false;
      }
    },
    async isVersionLatest() {
      return new Promise((resolve, reject) => {
        getVersionAPI().then(({ data: res }) => {
          if (res['@kotori-bot/kotori-plugin-webui'] !== `^${version}`) {
            this.$message.error('当前版本过低，请更新webui插件');
            if (!this.$route.path.includes('/login')) {
              this.$store.commit('layoutOption/updateToken');
              this.$router.push('/login');
            }
            reject(new Error('版本过低'));
          } else {
            resolve();
          }
        });
      });
    }
  },
  mounted() {
    this.isVersionLatest()
      .then(() => {
        this.handleAside();
        this.ws = new Ws();
        this.$store.dispatch('command/getCommands');
        this.$store.dispatch('modulesDetail/getData');
      })
      .catch(() => {});
  },
  beforeDestroy() {
    if (this.ws) {
      console.log(this.ws);
      this.ws.server.close();
    }
  },
  updated() {
    this.isVersionLatest()
      .then(() => {
        this.handleAside();
      })
      .catch(() => {});
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
.lessPadding {
  padding-left: 10px;
  padding-right: 10px;
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
