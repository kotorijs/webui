<template>
  <div class="pps-main">
    <div class="left">
      <router-link class="router" active-class="current" to="/qqCard">QQ卡片</router-link>
      <router-link class="router" active-class="current" to="/biliCard">bili卡片</router-link>
      <router-link class="router" active-class="current" to="/githubCard">github卡片</router-link>
      <slot></slot>
    </div>
    <div class="center">
      <router-view></router-view>
    </div>
    <div class="right"></div>
  </div>
</template>

<script>
export default {
  name: 'pps-main'
};
</script>

<style scoped>
.pps-main {
  display: flex;
  justify-content: space-around;
  margin: 10px auto 0;
  max-width: 1400px;
  height: fit-content;
}
.left {
  background-color: green;
}
.center {
  background-color: rebeccapurple;
}
.right {
  background-color: brown;
}
@media (min-width: 1200px) {
  .left {
    width: 22%;
  }
  .center {
    width: calc(56% - 20px);
  }
  .right {
    width: 22%;
  }
}
@media screen and (min-width: 996px) and (max-width: 1199px) {
  .left {
    width: 22%;
  }
  .center {
    height: 100%;
    width: calc(78% - 10px);
    margin-left: 10px;
  }
  .right {
    display: none;
  }
}
@media screen and (max-width: 995px) {
  .left {
    display: none;
  }
  .center {
    width: 100%;
    height: 100%;
  }
  .right {
    display: none;
  }
}
</style>
