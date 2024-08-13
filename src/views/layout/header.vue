<template>
  <el-header>
    <span class="header-left">
      <pps-button @click.native="onFold()">
        <i :class="arrowClass"></i>
      </pps-button>
      <pps-button @click="toggleFullscreen()">
        <i class="el-icon-full-screen"></i>
      </pps-button>
    </span>
    <span class="title header-center">{{ pathTitle }}</span>
    <span class="header-right">
      <pps-icon icon="pps-icon-github" @click="linkGithubFn" />
      <pps-icon icon="pps-icon-qq" @click="linkQQFn" />
      <pps-icon icon="pps-icon-help" @click="linkDocsFn" />
    </span>
  </el-header>
</template>

<script>
import { userFullScreen } from '@/mixin/index';
import { mapGetters } from 'vuex';
export default {
  name: 'kHeader',
  methods: {
    onFold() {
      this.$store.commit(
        'layoutOption/updateIsFoldAside',
        !this.$store.state.layoutOption.isFoldAside
      );
    },
    clearvuexFn() {
      localStorage.removeItem('vuex');
    },
    linkGithubFn() {
      window.open('https://github.com/kotorijs', '_blank');
    },
    linkQQFn() {
      window.open('https://qm.qq.com/q/Nb3lQPt7We', '_blank');
    },
    linkDocsFn() {
      window.open('https://kotori.js.org/', '_blank');
    }
  },
  computed: {
    ...mapGetters('layoutOption', ['getIsFoldAside']),
    pathTitle() {
      return this.$route.matched[1].meta.title;
    },
    isPadding() {
      if (this.$route.fullPath === '/console') {
        return true;
      }
      return false;
    },
    arrowClass() {
      if (this.getIsFoldAside) return 'el-icon-d-arrow-right';
      return 'el-icon-d-arrow-left'
    }
  },
  mixins: [userFullScreen]
};
</script>

<style lang="less">
.el-header {
  display: flex;
  position: relative;
  padding: 0;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  border-bottom: 2px solid #e1e2e8;
  background-color: var(--bg-main);
  height: var(--k-header-height) !important;

  .title {
    color: var(--font-gray-color);
    font-size: 1.17em;
    font-weight: 600;
    letter-spacing: 1px;
  }

  .header-left {
    flex: 1;
  }
  .header-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .header-right {
    flex: 1;
    text-align: right;

    .pps-icon {
      float: right;
      cursor: pointer;
      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
</style>
