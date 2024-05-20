<template>
  <form @submit.prevent="handleSubmit()">
    <slot></slot>
  </form>
</template>

<script>
export default {
  name: 'pps-form',
  methods: {
    handleSubmit() {
      this.$emit('submit');
    }
  },
  mounted() {}
};
</script>

<style></style>
