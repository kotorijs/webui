<template>
  <div ref="container" class="pps-context-menu-area">
    <slot name="content"></slot>
    <transition name="pps-context">
      <div
        ref="menu"
        v-if="isShowMenus"
        v-show="showContextMenu"
        :style="menuPosition"
        class="pps-context-menu_wrapper"
        @click="(e) => e.stopPropagation()"
      >
        <div class="pps-context-menu_prepend" v-if="$slots.prepend">
          <slot name="prepend"></slot>
        </div>
        <ul v-if="menus.length" class="pps-context-menu_inner">
          <slot name="item" :menu="menus">
            <li
              class="pps-context-menu-item"
              v-for="(item, index) in menus"
              :key="index"
              @click="handleSelect(item, $event)"
            >
              {{ item.label }}
            </li>
          </slot>
        </ul>
        <div class="pps-context-menu_append" v-if="$slots.append">
          <slot name="append"></slot>
        </div>
      </div>
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
    handleSelect(item, event) {
      event.stopPropagation();
      this.showContextMenu = false;
      this.$emit('select', item);
    },
    openMenu(e) {
      e.preventDefault();
      e.stopPropagation();
      this.x = e.clientX;
      this.y = e.clientY;
      this.showContextMenu = true;
      this.$nextTick(() => {
        requestAnimationFrame(() => {
          this.setPosition(e.clientX, e.clientY);
        });
      });
    },
    setPosition(clientX, clientY) {
      if (!this.isShowMenus) return;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      // requestAnimationFrame(() => {});
      const menu = this.$refs.menu;
      const originalTransition = menu.style.transition;
      const originalTransform = menu.style.transform;
      // const originalVisibility = menu.style.visibility;

      menu.style.transition = 'none';
      menu.style.transform = 'none';
      // menu.style.visibility = 'hidden';

      // 获取菜单尺寸
      const rect = this.$refs.menu.getBoundingClientRect();

      if (clientX + rect.width > windowWidth) {
        this.x = clientX - rect.width;
      }

      if (clientY + rect.height > windowHeight) {
        this.y = clientY - rect.height;
      }

      // eslint-disable-next-line no-unused-expressions
      menu.offsetHeight;

      // 恢复样式
      menu.style.transition = originalTransition;
      menu.style.transform = originalTransform;
      // menu.style.visibility = originalVisibility;
    },
    closeMenu() {
      this.showContextMenu = false;
    },
    bindClickEvents() {
      this.$refs.container.addEventListener('click', this.openMenu, false);
      this.setPosition();
    },
    bindContextEvents() {
      this.$refs.container.addEventListener('contextmenu', this.openMenu, false);
      window.addEventListener('contextmenu', this.closeMenu, true);
    }
  },
  computed: {
    isShowMenus() {
      return this.menus.length || this.$slots.prepend || this.$slots.append;
    },
    menuPosition() {
      return {
        left: this.x + 'px',
        top: this.y + 'px'
      };
    }
  },
  mounted() {
    this.$refs.container.addEventListener('contextmenu', this.openMenu, true);
    window.addEventListener('click', this.closeMenu, true);
    window.addEventListener('contextmenu', this.closeMenu, true);
  },
  beforeDestroy() {
    this.$refs.container.removeEventListener('contextmenu', this.openMenu);
    window.removeEventListener('click', this.closeMenu);
    window.removeEventListener('contextmenu', this.closeMenu);
  },
  props: {
    menus: {
      default() {
        return [];
      }
    },
    trigger: {
      type: String,
      default() {
        return 'contextmenu';
      }
    }
  }
};
</script>
