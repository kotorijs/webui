<template>
  <section :class="`k-container-${direction}`">
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'k-container',
  props: {
    direction: {
      type: String,
      default: 'horizontal'
    }
  },
  computed: {}
};
</script>

<style>
.k-container-horizontal {
  display: flex;
  flex-direction: row;
}
.k-container-vertical {
  display: flex;
  flex-direction: column;
}
</style>
