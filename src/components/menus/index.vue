<template>
  <ul
    class="k-menu"
    :style="{
      flexDirection: this.mode
    }"
  >
    <slot></slot>
  </ul>
</template>

<script>
import Vue from 'vue';
export default {
  name: 'k-menu',
  data() {
    return {
      activeIndex: this.defaultActive
    };
  },
  provide() {
    return {
      root: this
    };
  },
  props: {
    activeColor: {
      type: String
    },
    activeShape: {
      type: Array,
      default() {
        return [];
      }
    },
    backgroundColor: {
      type: String
    },
    textColor: {},
    mode: {
      type: String,
      default() {
        return 'column';
      }
    },
    defaultActive: {
      type: String
    },
    router: {
      type: Boolean
    }
  },
  methods: {
    changeRouteFn(path) {
      if (this.router) {
        this.$router.push(path);
      }
      this.activeIndex = path;
    }
  },
  computed: {
    rootMenu() {
      return {
        activeColor: this.activeColor,
        backgroundColor: this.backgroundColor,
        activeIndex: this.defaultActive
      };
    }
  },
  watch: {
    defaultActive(val) {
      this.activeIndex = val;
    }
  },
  beforeCreate() {
    this.$bus = new Vue();
  },
  mounted() {
    this.$bus.$on('changeRoute', this.changeRouteFn);
  },
  beforeDestroy() {
    this.$bus.$off('changeRoute', this.changeRouteFn);
  }
};
</script>

<style lang="less" scoped>
.k-menu {
  display: flex;
  list-style: none;
  // overflow-x: auto;
  height: auto;

  &::-webkit-scrollbar {
    width: 0px; // 设置滚动条的宽度
    height: 0;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
    width: 0px;
    height: 0;
  }
  &::-webkit-scrollbar-thumb {
    position: absolute;
    width: 0px;
    border-radius: 6px;
    background-color: #8888881a;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #88888829; // 鼠标悬停时滚动条的颜色
  }
}
</style>
