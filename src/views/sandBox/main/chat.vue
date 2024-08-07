<template>
  <div class="k-chat-main chat-empty">
    <!-- 聊天内容 -->
    <div class="k-chat-box"></div>

    <!-- 输入框 -->
    <div class="k-chat-input"></div>
  </div>
</template>

<script>
export default {
  name: 'k-chat-main'
};
</script>

<style lang="less">
.k-chat-main {
  display: flex;
  flex-direction: column;
  background: #f2f2f2;
  width: 100%;

  .k-chat-box {
    height: 100%;
  }

  .k-chat-input {
    height: 200px;
    background: #f2f2f2;
    border-top: 2px solid #e9e9e9;
    border-bottom: 2px solid #e9e9e9;
  }
}
.chat-empty {
  height: calc(var(--k-main-height) - var(--k-footer-height) - 60px);
}
</style>
