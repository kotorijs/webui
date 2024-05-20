<template>
  <div class="pps-header">
    <slot><h2>header</h2></slot>
  </div>
</template>

<script>
export default {
  name: 'pps-header'
};
</script>

<style scoped>
div {
  width: 100%;
  height: 100px;
  background-color: antiquewhite;
}
</style>
