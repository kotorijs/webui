<template>
  <form class="pps-form" @submit.prevent="handleSubmit()" @reset.prevent="handleReset()">
    <slot></slot>
  </form>
</template>

<script>
export default {
  name: 'pps-form',
  methods: {
    handleSubmit() {
      this.$emit('submit');
    },
    handleReset() {
      this.$emit('reset');
    }
  },
  mounted() {}
};
</script>

<style></style>
