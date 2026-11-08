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

const compareVersions = (v1, v2) => {
  if (!v1 || !v2) return 0;
  const clean1 = String(v1).replace(/^[^\d]+/, '');
  const clean2 = String(v2).replace(/^[^\d]+/, '');
  const parts1 = clean1.split('-')[0].split('.').map((n) => parseInt(n, 10) || 0);
  const parts2 = clean2.split('-')[0].split('.').map((n) => parseInt(n, 10) || 0);
  const maxLen = Math.max(parts1.length, parts2.length);

  for (let i = 0; i < maxLen; i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
};

export default {
  name: 'myLayout',
  components: { kAside, kFooter, kHeader },
  data() {
    return {
      hasCheckedVersion: false
    };
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
      // 避免重复检测和重复弹窗
      if (this.hasCheckedVersion) return;
      this.hasCheckedVersion = true;

      try {
        const { data: res } = await getVersionAPI();
        const remoteVersion = res && res['@kotori-bot/kotori-plugin-webui'];
        // 仅在当前版本严格低于最新发布版本时弹窗警告；若当前版本大于或等于最新发布版本则不处理
        if (remoteVersion && compareVersions(version, remoteVersion) < 0) {
          const cleanRemote = String(remoteVersion).replace(/^[^\d]+/, '');
          this.$message.warning(`当前版本(v${version})过低，最新版本为 v${cleanRemote}，请及时更新 webui 插件`);
        }
      } catch (err) {
        console.error('获取版本信息失败', err);
      }
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
    this.handleAside();
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
