<template>
  <aside class="k-sb-aside">
    <slot></slot>
  </aside>
</template>

<script>
export default {
  name: 'k-sb-aside'
};
</script>

<style>
.k-sb-aside {
  display: flex;
  flex-direction: column;
  width: 300px;
  background: #0000ff33;
}</style>
