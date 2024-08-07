<template>
  <li
    class="k-menu-item"
    :class="{ 'is-active': active }"
    :style="[itemStyle]"
    @mouseenter="onmouseenterFn"
    @mouseleave="onMouseLeaveFn"
    @click="handleClickFn"
  >
    <transition appear name="appear">
      <div
        v-show="active"
        class="line"
        :style="{ background: this.root.activeColor }"
      ></div>
    </transition>
    <slot></slot>
  </li>
</template>

<script>
export default {
  name: 'k-menu-item',
  data() {
    return {};
  },
  inject: ['root'],
  props: {
    icon: {
      type: String,
      default() {
        return '';
      }
    },
    index: {
      type: String
    }
  },
  methods: {
    onmouseenterFn() {
      this.$el.style.backgroundColor = this.root.backgroundColor;
    },
    onMouseLeaveFn() {
      this.$el.style.backgroundColor = '';
    },
    handleClickFn() {
      this.root.$bus.$emit('changeRoute', this.index);
      this.$emit('click', this);
    }
  },
  computed: {
    active() {
      const activeArr = this.root.activeIndex.split('/');
      const indexArr = this.index.split('/');
      return activeArr.includes(indexArr[1]);
    },
    itemStyle() {
      const style = {
        color: this.active ? this.root.activeColor : this.root.textColor,
        borderLeftColor: this.active ? this.root.activeColor : this.root.textColor
      };
      return style;
    }
  },
  beforeMount() {},
  mounted() {}
};
</script>

<style lang="less" scoped>
.k-menu-item {
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  margin-bottom: 5px;
  text-align: center;
  list-style-type: none;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;

  .line {
    position: absolute;
    left: 0;
    height: 70%;
    width: 4px;
    border-radius: 0 8px 8px 0;
  }
}

/* 进入的起点、离开的终点 */
.appear-enter,
.appear-leave-to {
  // transform: scaleY(0);
  transform: translateX(-100%);
}
.appear-enter-active,
.appear-leave-active {
  transition: 0.2s ease;
}
/* 进入的终点、离开的起点 */
.appear-enter-to,
.appear-leave {
  // transform: scaleY(1);
  transform: translateX(0);
}
</style>
