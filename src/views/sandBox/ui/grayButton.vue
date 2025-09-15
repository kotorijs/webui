<template>
  <div class="gray-btn">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'gray-button'
};
</script>

<style lang="scss">
.gray-btn {
  width: 33px;
  height: 33px;
  border: none;
  background-color: #eeeeee;
  border-radius: 5px;
  color: #636c76;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #e2e2e2;
  }
  &:active {
    background-color: #d7d7d7;
  }
}
</style>
