<template>
  <div ref="container" class="pps-context-menu-wrapper">
    <slot name="content"></slot>
    <transition name="appear">
      <ul
        ref="menu"
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
          <slot name="item" :scope="item">{{ item.label }}</slot>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'pps-context-menu',
  directives: {
    animation: {
      bind(element, binding) {
        element.animate(
          [
            { transform: 'scale(0)', opacity: 0 },
            { transform: 'scale(1)', opacity: 1 }
          ],
          {
            duration: 300,
            easing: 'ease'
          }
        );
      }
    }
  },
  props: {
    menus: {
      default() {
        return [];
      }
    },
    position: {
      type: String,
      default() {
        return 'right';
      }
    },
    trigger: {
      type: String,
      default() {
        return 'contextmenu';
      }
    }
  },
  data() {
    return {
      showContextMenu: false,
      x: 0,
      y: 0,
      isBottom: false,
      isRight: false
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
      this.setPosition();
      if (!this.isRight) this.x = e.clientX;
      if (!this.isBottom) this.y = e.clientY;
      this.showContextMenu = true;
    },
    setPosition() {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const crect = this.$refs.container.getBoundingClientRect();
      this.$refs.menu.style.display = '';
      const ulrect = this.$refs.menu.getBoundingClientRect();
      this.$refs.menu.style.display = 'none';
      if (windowHeight - crect.bottom < ulrect.height) {
        this.isBottom = true;
        console.warn('[pps-ui]底部超出');
        this.y = windowHeight - ulrect.height - crect.height;
      }
      if (windowWidth - crect.right < ulrect.width) {
        this.isRight = true;
        console.warn('[pps-ui]右侧超出');
        this.x = windowWidth - ulrect.width;
      }
    },
    closeMenu() {
      this.showContextMenu = false;
    }
  },
  mounted() {
    this.$refs.container.addEventListener('contextmenu', this.openMenu, false);
    window.addEventListener('click', this.closeMenu, true);
    window.addEventListener('contextmenu', this.closeMenu, true);
    this.setPosition();
  },
  beforeDestroy() {
    this.$refs.container.removeEventListener('contextmenu', this.openMenu);
    window.removeEventListener('click', this.closeMenu);
    window.removeEventListener('contextmenu', this.closeMenu);
  }
};
</script>

<style lang="less">
.pps-context-menu-wrapper {
  position: relative;
}
.pps-context-menu {
  position: fixed;
  padding: 5px;
  background: #ffffff;
  border-radius: 5px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.232);
  z-index: 100;
  transition: 0.3s ease;
}
.pps-context-menu-item {
  padding: 5px 10px;
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
  }
}
.appear-enter,
.appear-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
.appear-enter-to,
.appear-leave {
  opacity: 1;
  transform: scale(1);
}
</style>
