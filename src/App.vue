<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style scoped lang="less">
#app {
  height: 100%;
}
</style>

<script>
export default {
  name: 'App',
  mounted() {
    console.error('更新kams的版本，添加版本不一致清空缓存');
  }
};
</script>
