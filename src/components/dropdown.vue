<template>
  <div class="dropdown-wrapper">
    <div class="dropdown" @click="isShowSelect = !isShowSelect">
      <input class="select-label" type="text" readonly :value="`${text}`" />
      <div class="icon">
        <i class="el-icon-arrow-down"></i>
      </div>
    </div>
    <div class="dropdown-menu" v-show="isShowSelect">
      <div
        class="select-item"
        v-for="(item, index) in menu"
        :key="index"
        @click="selectSslFn(item)"
      >
        {{ `${item}` }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dropdown',
  data() {
    return {
      isShowSelect: false,
      text: ''
    };
  },
  props: {
    menu: Array,
    current: String
  },
  methods: {
    selectSslFn(ssl) {
      this.isShowSelect = false;
      this.text = ssl;
      this.$emit('select', ssl);
    },
    close(e) {
      if (!this.$el.contains(e.target)) {
        this.isShowSelect = false;
      }
    }
  },
  watch: {
    current(val) {
      this.text = val;
    }
  },
  mounted() {
    this.text = this.current || this.menu[0];
    document.addEventListener('click', this.close);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.close);
  }
};
</script>

<style lang="scss">
.dropdown-wrapper {
  position: relative;
  height: 100%;
  border-radius: inherit;
}
.dropdown {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  padding: 0 5px;
  width: auto;
  border-radius: inherit;
  background: #f5f7fa;
  cursor: pointer;

  .select-label {
    width: 3.8rem;
    text-align: center;
    // padding: 0 10px;
    background: transparent;
    height: 100%;
    outline: none;
    border: none;
    box-sizing: border-box;
    cursor: pointer;
  }

  .icon {
    margin-left: -5px;
  }
}
.dropdown-menu {
  position: absolute;
  left: 0;
  top: calc(100% + 5px);
  padding: 10px 0;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 2;

  .select-item {
    min-width: fit-content;
    padding: 5px 15px;
    cursor: pointer;

    &:hover {
      background: #f0f0f0;
    }
  }
}
</style>
