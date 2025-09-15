<template>
  <div>
    <input ref="input" type="text" v-bind="$attrs" @input="handleInput" @change="handleChange" />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleInput(e) {
      this.$emit('input', e.target.value);
    },
    handleChange(e) {
      this.$emit('change', e.target.value);
    },
    setNativeInputValue() {
      const input = this.$refs.input;
      const val = this.value === null || this.value === undefined ? '' : String(this.value);
      if (input.value === val) return;
      input.value = val;
    }
  },
  mounted() {
    this.setNativeInputValue();
  }
};
</script>

<style></style>
