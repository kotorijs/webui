<template>
  <div class="pps-footer">
    <slot><h2>footer</h2></slot>
  </div>
</template>

<script>
export default {
  name: 'pps-footer'
};
</script>

<style scoped>
div {
  height: 60px;
  margin: 10px auto 0;
  background-color: chocolate;
}
</style>
