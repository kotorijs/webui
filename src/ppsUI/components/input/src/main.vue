<template>
  <div class="pps-input-wrapper">
    <label v-if="label" :for="label" class="pps-input-label">{{ label }}:</label>
    <div class="pps-input__prepend" v-if="$slots.prepend">
      <slot name="prepend"></slot>
    </div>
    <div
      :class="[
        { [theme]: !disabled },
        { 'is-disabled': disabled },
        { 'pps-input--prepend': $slots.prepend },
        { 'pps-input--append': $slots.append }
      ]"
      class="pps-input-inner"
    >
      <!-- <component v-if="icon" :is="dynamicComponent"></component> -->
      <pps-icon :icon="icon" v-if="icon"></pps-icon>
      <input
        ref="input"
        :id="label"
        v-bind="$attrs"
        v-on="$listeners"
        :type="viewPassword ? (showPassword ? 'text' : 'password') : type"
        class="pps-input"
        :disabled="disabled"
        :placeholder="placeholder"
        v-model.trim="keyWord"
        @blur="handleBlur"
      />
      <span class="pps-input-suffix">
        <i class="icon icon-clear" v-if="clearable" @click="clearFn()"></i>
        <i class="icon icon-view" v-if="showPasswordIcon" @click="viewPasswordFn()"></i>
      </span>
      <div class="operation" v-if="$slots.default">
        <slot></slot>
      </div>
    </div>
    <div class="pps-input__append" v-if="$slots.append">
      <slot name="append"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ppsInput',
  inheritAttrs: false,
  data() {
    return {
      keyWord: '',
      showPassword: false
    };
  },
  props: {
    placeholder: {
      type: String,
      default() {
        return '请输入内容';
      }
    },
    theme: {
      type: String,
      default() {
        return 'white';
      }
    },
    type: {
      type: String,
      default() {
        return 'text';
      }
    },
    icon: {
      type: String,
      default() {
        return '';
      }
    },
    content: {},
    label: {
      type: String,
      default() {
        return null;
      }
    },
    disabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    viewPassword: {
      type: Boolean,
      default() {
        return false;
      }
    },
    clearable: {
      type: Boolean,
      default() {
        return false;
      }
    },
    'after-clear': {
      type: Function,
      default() {
        return () => {};
      }
    }
  },
  methods: {
    clearFn() {
      console.log('clear');
      this.keyWord = '';
      this.$refs.input.focus();
      this.afterClear();
    },
    viewPasswordFn() {
      this.showPassword = !this.showPassword;
    },
    handleBlur(e) {
      if (!this.keyWord) {
        this.showPassword = false;
      }
    }
  },
  computed: {
    showPasswordIcon() {
      return this.viewPassword && this.keyWord;
    }
  },
  watch: {
    keyWord() {
      this.$emit('update:content', this.keyWord);
    },
    content: {
      immediate: true,
      handler(n) {
        this.keyWord = n;
      }
    }
  },
  mounted() {}
};
</script>
