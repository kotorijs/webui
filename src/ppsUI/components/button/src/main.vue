<template>
  <button
    v-bind="$attrs"
    v-on="$listeners"
    class="pps-button"
    :class="[theme ? `pps-button-${theme}` : `pps-button-default`]"
  >
    <slot>pps-button</slot>
  </button>
</template>

<script>
export default {
  name: 'ppsButton',
  inheritAttrs: false,
  props: {
    theme: {
      type: String,
      default() {
        return '';
      }
    },
    content: {
      type: String,
      default() {
        return 'pps-button';
      }
    },
    handleData: {
      type: Object
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
