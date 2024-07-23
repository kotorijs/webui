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
}
</style>
