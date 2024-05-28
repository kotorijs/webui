<template>
  <el-header height="40px">
    <pps-button @click.native="onFold()">
      <i class="el-icon-d-arrow-left"></i>
    </pps-button>
    <span class="title">{{ pathTitle }}</span>
    <pps-button @click="$store.commit('layoutOption/updateToken', '')">
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

<style></style>
