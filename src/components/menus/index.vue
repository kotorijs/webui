<template>
  <ul class="k-menu">
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
      type: String,
      default() {
        return 'line';
      }
    },
    backgroundColor: {
      type: String
    },
    textColor: {},
    mode: {
      type: String
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
      this.activeIndex = path;
      if (this.router) {
        this.$router.push(path);
      }
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
    defaultActive(val) {}
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
  list-style: none;
  overflow-x: auto;
  height: auto;

  &::-webkit-scrollbar {
    width: 1px; // 设置滚动条的宽度
    height: 0;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
    width: 1px;
    height: 0;
  }
  &::-webkit-scrollbar-thumb {
    position: absolute;
    width: 1px;
    border-radius: 6px;
    background-color: #8888881a;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #88888829; // 鼠标悬停时滚动条的颜色
  }
}
</style>
