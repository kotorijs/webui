<template>
  <div class="pps-input-wrapper">
    <div v-if="label" class="pps-input-label">{{ label }}:</div>
    <div class="pps-input__prepend" v-if="$slots.prepend">
      <slot name="prepend"></slot>
    </div>
    <div
      :class="[
        { [color]: !disabled },
        { 'is-disabled': disabled },
        { 'pps-input--prepend': $slots.prepend },
        { 'pps-input--append': $slots.append }
      ]"
      class="pps-input-inner"
    >
      <component v-if="icon" :is="dynamicComponent"></component>

      <input
        ref="input"
        v-bind="$attrs"
        v-on="$listeners"
        :type="type"
        class="pps-input"
        :disabled="disabled"
        :placeholder="placeholder"
        v-model.trim="keyWord"
      />

      <span class="pps-input-suffix" v-if="clearable" @click="clearFn()">
        <i class="icon-clear"></i>
      </span>

      <div class="space"></div>
      <div class="operation">
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
      dynamicComponent: null
    };
  },
  props: {
    placeholder: {
      type: String,
      default() {
        return '请输入内容';
      }
    },
    color: {
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
        return '';
      }
    },
    disabled: {
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
    }
  },
  computed: {
    whichIcon() {
      return 'ppsIconAdmin';
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
    },
    async icon(newVal) {
      if (newVal) {
        const componentName = newVal.replace('pps-icon-', '');
        const component = await import(`./icon/${componentName}.vue`);
        this.dynamicComponent = component.default;
      }
    }
  },
  async created() {
    if (this.icon) {
      const componentName = this.icon.replace('pps-icon-', '');
      const component = await import(`./icon/${componentName}.vue`);
      this.dynamicComponent = component.default;
    }
  }
};
</script>

<style lang="less" scoped>
@font-face {
  font-family: iconfont;
  src: url(./font/elicon.woff);
}
.pps-input__prepend {
  height: 100%;
  border-top-left-radius: var(--radius);
  border-bottom-left-radius: var(--radius);
  border: 1px solid #d3d5d7;
  border-right: none;
}
.pps-input__append {
  height: 100%;
  border-top-right-radius: var(--radius);
  border-bottom-right-radius: var(--radius);
  border: 1px solid #d3d5d7;
  border-left: none;

  .pps-button {
    // margin-left: 5px;
    background: transparent;
    border: none;
    height: 100%;
    background: #e3e5e7;
    border-radius: 0;
    border-top-right-radius: var(--radius);
    border-bottom-right-radius: var(--radius);
  }
}
.pps-input-suffix {
  position: absolute;
  right: 5px;
  height: 100%;
  display: flex;
  align-items: center;
}
.icon-clear {
  font-size: 14px;
  font-style: normal;
  font-family: iconfont;
  color: rgba(0, 0, 0, 0.4);
  cursor: pointer;
  display: none;
  background: #fff;

  &:hover {
    color: rgba(0, 0, 0, 0.8);
    display: initial;
  }
  &::before {
    content: '\e78d';
  }
}
/*=============== input默认样式设置 ===============*/
.pps-input {
  outline: none;
  width: 90%;
  height: 28px;
  margin-left: 5px;
  padding-right: 14px;
  background: none;
  border: none;
  font-size: 15px;
  color: #2e2e2e;

  &[type='number']::-webkit-inner-spin-button,
  &[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type='password']::-webkit-contacts-auto-fill-button {
    display: none !important;
  }
  &::-ms-reveal,
  &::-ms-clear {
    display: none;
  }
  &[disabled] {
    cursor: not-allowed;
  }
  &:hover + .pps-input-suffix .icon-clear {
    display: initial;
    cursor: pointer;
  }
  &:focus + .pps-input-suffix .icon-clear {
    display: initial;
  }
}
.pps-icon {
  margin-left: 5px;
  width: auto;
  height: fit-content;
}
svg {
  display: block;
}
.pps-input-wrapper {
  display: flex;
  // justify-content: space-between;
  align-items: center;
  height: 36px;
  --radius: 8px;

  .pps-input-label {
    margin-right: 15px;
  }
  .space {
    width: 0;
    flex: 1;
  }
  .operation {
    display: inline-flex;
    padding-inline-end: 5px;
  }
  .pps-input {
    padding-inline-start: 5px;
  }

  & + & {
    margin-top: 20px;
  }
}
.pps-input-inner {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  border-radius: var(--radius);
  border: 1px solid #d3d5d7;
  background: #fff;
}
.pps-input--prepend {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.pps-input--append {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
/*=============== 白色系搜索框设置 ===============*/
.white {
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid #d3d5d7;
  background: #fff;
  transition: 0.2s cubic-bezier(0.65, 0.05, 0.36, 1);
}
.white .pps-input {
  outline: none;
  width: 90%;
  height: 28px;
  margin-left: 5px;
  background: none;
  border: none;
  font-size: 15px;
  color: #2e2e2e;
}
.white:focus-within {
  border-color: #409eff;
  box-shadow: 0px 0px 2px 0px #409eff;
}
.white:hover {
  border-color: #409eff;
  transition: all 50ms linear 50ms;
}
.white .pps-input:hover {
  filter: brightness(70%);
}
.pps-input-error::placeholder {
  color: red;

  /*===================== end =====================*/
}

/*=============== 黑色系搜索框设置 ===============*/
.black {
  // position: relative;
  height: 46px;
  border: 2px solid #8f8f8f;
  border-radius: 15px 15px 15px 15px;
  background: #2e2e2e;
}
.black input {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 10px;
  margin: auto;
  outline: none;
  width: 200px;
  height: 30px;
  background: none;
  border: none;
  font-size: 15px;
  color: #fff;
}
.black button {
  position: absolute;
  right: 6px;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 50px;
  height: 35px;
  color: #2e2e2e;
  font-weight: bold;
}
.black input:focus {
  border-bottom: 2px solid #fff;
}
.black input:hover {
  filter: brightness(120%);
}
/*===================== end =====================*/

.is-disabled {
  background: #e3e5e7;
  cursor: not-allowed;
}
</style>
