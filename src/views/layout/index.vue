<template>
  <el-container class="main-container" v-resize-ob="resizeFn">
    <k-aside></k-aside>
    <el-container class="kams-main-container" direction="vertical">
      <k-header></k-header>
      <el-main :class="{ isPadding, lessPadding: getIsNarrowScreen }">
        <transition mode="out-in">
          <keep-alive include="kConsole">
            <router-view></router-view>
          </keep-alive>
        </transition>
      </el-main>
      <k-footer v-if="isFooter"></k-footer>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
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
    return {};
  },
  methods: {
    ...mapActions('modulesDetail', { getModules: 'getData' }),
    ...mapActions('command', ['getCommands']),
    handleAside() {
      if (uniqueRoutes.includes(this.$route.fullPath) || this.isSmall) {
        this.$store.commit('layoutOption/updateIsFoldAside', true);
      } else {
        this.$store.commit('layoutOption/updateIsFoldAside', false);
      }
    },
    resizeFn(w, h) {
      if (Math.floor(w) <= 528) {
        this.$store.commit('layoutOption/updateIsNarrowScreen', true);
      } else {
        this.$store.commit('layoutOption/updateIsNarrowScreen');
      }
    },
    async isVersionLatest() {
      // 判断是否最新版本
      return new Promise((resolve, reject) => {
        getVersionAPI().then(({ data: res }) => {
          const lastVersion = res['@kotori-bot/kotori-plugin-webui'].slice(1).split('.').join('');
          const localVersion = version.split('.').join('');
          if (localVersion < lastVersion) {
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
  mounted() {},
  created() {
    this.getCommands();
    this.getModules();
    this.isVersionLatest()
      .then(() => {
        this.handleAside();
        this.$ws.init();
      })
      .catch(() => {});
  },
  beforeDestroy() {
    console.log('layout beforeDestroy');
    if (this.$ws.instance) {
      this.$ws.close();
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
    ...mapGetters('layoutOption', ['getIsFoldAside', 'getIsNarrowScreen']),
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

<style lang="scss" scoped>
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
  max-width: 100vw;

  .kams-main-container {
    flex-basis: 0;
    flex: 1;
  }

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
.v-enter {
  opacity: 0;
  transform: translateX(-30px);
}
.v-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.v-enter-active,
.v-leave-active {
  transition: all 0.5s;
}
</style>
