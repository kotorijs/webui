<template>
  <div ref="container" class="pps-context-menu-wrapper">
    <slot></slot>
    <ul
      class="pps-context-menu"
      v-show="showContextMenu"
      :style="{ left: x + 'px', top: y + 'px' }"
    >
      <li
        class="pps-context-menu-item"
        v-for="(item, index) in menus"
        :key="index"
        @click="handleSelect(item)"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'pps-context-menu',
  props: {
    menus: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      showContextMenu: false,
      x: 0,
      y: 0
    };
  },
  methods: {
    handleSelect(item) {
      this.showContextMenu = false;
      this.$emit('select', item);
    },
    openMenu(e) {
      e.preventDefault();
      e.stopPropagation();
      this.showContextMenu = true;
      this.x = e.clientX + 15;
      this.y = e.clientY;
    },
    closeMenu() {
      this.showContextMenu = false;
    }
  },
  mounted() {
    this.$refs.container.addEventListener('contextmenu', this.openMenu, false);
    window.addEventListener('click', this.closeMenu, true);
    window.addEventListener('contextmenu', this.closeMenu, true);
  },
  beforeDestroy() {
    this.$refs.container.removeEventListener('contextmenu', this.openMenu);
    window.removeEventListener('click', this.closeMenu);
    window.removeEventListener('contextmenu', this.closeMenu);
  }
};
</script>

<style lang="less">
.pps-context-menu {
  position: fixed;
  width: auto;
  height: auto;
  padding: 5px;
  background: #ffffff;
  border-radius: 5px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.232);
  z-index: 2;
}
.pps-context-menu-item {
  padding: 5px 10px;
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
  }
}
</style>
