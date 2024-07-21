<template>
  <el-header height="40px">
    <pps-button @click.native="onFold()">
      <i class="el-icon-d-arrow-left"></i>
    </pps-button>
    <span class="title">{{ pathTitle }}</span>
    <pps-button @click="$store.commit('layoutOption/updateToken', '123')">
      clear
    </pps-button>
  </el-header>
</template>

<script>
export default {
  name: 'kHeader',
  methods: {
    onFold() {
      this.$store.commit(
        'layoutOption/updateIsFoldAside',
        !this.$store.state.layoutOption.isFoldAside
      );
    }
  },
  computed: {
    pathTitle() {
      return this.$route.matched[1].meta.title;
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

<style lang="less">
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
      letter-spacing: 1px;
    }
  }
</style>
