<template>
  <nav>
    <slot><h2>navbar</h2></slot>
  </nav>
</template>

<script>
export default {
  name: 'pps-nav'
};
</script>

<style scoped>
nav {
  position: sticky;
  top: 0px;
  width: 100%;
  background-color: aquamarine;
  height: 60px;
}
</style>
