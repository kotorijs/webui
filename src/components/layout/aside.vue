<template>
  <aside class="k-sb-aside k-aside">
    <div><slot></slot></div>
  </aside>
</template>

<script>
export default {
  name: 'k-sb-aside'
};
</script>

<style lang="less">
.k-sb-aside {
  display: flex;
  flex-direction: column;
  overflow: auto;
  background: #fff;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    width: 5px; // 设置滚动条的宽度
    height: 0;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
    width: 0px;
    height: 0;
  }
  &::-webkit-scrollbar-thumb {
    position: absolute;
    // width: 0px;
    border-radius: 6px;
    background-color: #8888881a;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #88888829; // 鼠标悬停时滚动条的颜色
  }
}
</style>
