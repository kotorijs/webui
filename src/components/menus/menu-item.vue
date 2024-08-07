<template>
  <el-tooltip ref="tooltip" class="item" effect="dark" :content="title" placement="right" manual>
    <li
      class="k-menu-item"
      :class="{ 'is-active': active }"
      :style="[itemStyle]"
      @mouseenter="onmouseenterFn"
      @mouseleave="onMouseLeaveFn"
      @click="handleClickFn"
    >
      <template v-if="root.activeShape === 'line'">
        <transition appear name="appear">
          <div v-show="active" class="line" :style="{ background: root.activeColor }"></div>
        </transition>
      </template>
      <template v-if="root.activeShape === 'circle'">
        <transition appear>
          <div v-show="active" class="circle"></div>
        </transition>
      </template>
      <slot></slot>
    </li>
  </el-tooltip>
</template>

<script>
export default {
  name: 'k-menu-item',
  data() {
    return {
      activeColor: this.root.activeColor
    };
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
    },
    title: {
      type: String
    },
    width: {
      type: String,
      default() {
        return '70';
      }
    }
  },
  methods: {
    onmouseenterFn() {
      this.$el.style.backgroundColor = this.root.backgroundColor;
      this.handleTooltipFn(true);
    },
    onMouseLeaveFn() {
      this.$el.style.backgroundColor = '';
      this.handleTooltipFn(false);
    },
    handleClickFn() {
      this.root.$bus.$emit('changeRoute', this.index);
      this.$emit('click', this);
    },
    handleTooltipFn(isShow) {
      this.$refs.tooltip.showPopper = isShow;
    }
  },
  computed: {
    active() {
      if (!this.root.router) return this.root.activeIndex === this.index;
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
  width: calc(v-bind(width) * 1px);
  height: calc(v-bind(width) * 1px);
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

  .circle {
    position: absolute;
    margin: 0 auto;
    height: 77%;
    width: 77%;
    border: 3px solid v-bind(activeColor);
    filter: drop-shadow(0 0 4px v-bind(activeColor));
    border-radius: 50%;
  }
}
.k-menu-item + .k-menu-item {
  margin-top: 10px;
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
