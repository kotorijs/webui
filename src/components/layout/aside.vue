<template>
  <aside ref="aside" class="k-sb-aside k-aside">
    <div class="k-aside-default">
      <slot></slot>
    </div>
    <div class="k-aside-inner">
      <slot name="inner"></slot>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'k-sb-aside'
};
</script>

<style lang="less">
.k-aside {
  display: flex;
  flex-direction: column;
  background: #fff;
  box-sizing: border-box;
  height: 100%;
}
.k-aside-inner {
  overflow: auto;
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
    right: -10px;
    // width: 0px;
    border-radius: 6px;
    background-color: #8888881a;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #88888833; // 鼠标悬停时滚动条的颜色
  }
}
</style>
