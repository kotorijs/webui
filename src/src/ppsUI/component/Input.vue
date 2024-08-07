<template>
  <div :class="color" class="pps-input">
    <component v-if="icon" :is="dynamicComponent"></component>
    <input v-bind="$attrs" v-on="$listeners" :type="type" :placeholder="placeholder" v-model.trim="keyWord" />
    <slot></slot>
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
    content: {}
  },
  methods: {},
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
/*=============== input默认样式设置 ===============*/
input {
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
}
.pps-icon {
  margin-left: 5px;
  width: auto;
  height: fit-content;
}
svg {
  display: block;
}
/*=============== 白色系搜索框设置 ===============*/
.white {
  display: flex;
  height: 36px;
  flex-direction: row;
  /* justify-content: left; */
  align-items: center;
  border: 1px solid #d3d5d7;
  border-radius: 8px;
  background: #e3e5e7;
}
.white input {
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
input:hover {
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
</style>
