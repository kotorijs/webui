<template>
  <k-container direction="horizontal">
    <k-sb-aside>
      <div class="empty"></div>
    </k-sb-aside>
    <k-container direction="vertical" style="width: 100%">
      <header class="k-chat-header"></header>
      <k-container direction="horizontal">
        <div class="k-chat-main chat-empty">
          <div class="k-chat-box"></div>
          <div class="k-chat-input"></div>
        </div>
        <k-sb-aside class="k-sb-aside" style="background: green">aside-right</k-sb-aside>
      </k-container>
    </k-container>
  </k-container>
</template>

<script>
import kContainer from '@/components/layout/container';
import kSbAside from '@/components/layout/aside';
export default {
  name: 'sendBox',
  components: { kContainer, kSbAside }
};
</script>

<style lang="less">
.k-chat-main {
  display: flex;
  flex-direction: column;
  background: gray;
  width: 100%;

  .k-chat-box {
    height: 100%;
  }

  .k-chat-input {
    height: 200px;
    background: #000;
  }
}
.k-chat-header {
  height: 60px;
  background: #ffff004e;
}
.empty {
  height: calc(var(--k-main-height) - var(--k-footer-height));
}
.chat-empty {
  height: calc(var(--k-main-height) - var(--k-footer-height) - 60px);
}
</style>
