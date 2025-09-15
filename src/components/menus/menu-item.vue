<template>
  <el-tooltip
    :disabled="!tips"
    ref="tooltip"
    class="item"
    effect="dark"
    :content="title"
    placement="right"
    manual
  >
    <li
      class="k-menu-item"
      :class="[{ className }, { active }, direction]"
      :style="[
        itemStyle,
        { height: `${height}px`, minHeight: `${height}px` },
        { justifyContent: align }
      ]"
      @mouseenter="onmouseenterFn"
      @mouseleave="onMouseLeaveFn"
      @click="handleClickFn"
    >
      <template v-if="activeShape.includes('line')">
        <transition appear name="appear">
          <div
            v-show="active"
            class="current-shape line"
            :style="{ background: root.activeColor }"
          ></div>
        </transition>
      </template>
      <template v-if="activeShape.includes('circle')">
        <transition appear>
          <div v-show="active" class="current-shape circle" :style="circleStyle"></div>
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
  methods: {
    onmouseenterFn() {
      this.$el.style.backgroundColor = this.root.backgroundColor;
      this.handleTooltipFn(true);
    },
    onMouseLeaveFn() {
      if (this.activeShape.includes('background') && this.active) return;
      this.$el.style.backgroundColor = '';
      this.handleTooltipFn(false);
    },
    handleClickFn() {
      this.root.$bus.$emit('changeRoute', this.index);
      this.$emit('click', this);
      this.root.$emit('select', this);
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
        borderLeftColor: this.active ? this.root.activeColor : this.root.textColor,
        backgroundColor: ''
      };
      if (this.activeShape.includes('background')) {
        style.backgroundColor = this.active ? this.root.backgroundColor : '';
      }
      return style;
    },
    circleStyle() {
      return {
        border: `3px solid ${this.root.activeColor}`,
        filter: `drop-shadow(0 0 4px ${this.root.activeColor})`
      };
    },
    activeShape() {
      return this.root.activeShape;
    },
    tips() {
      if (this.title) return true;
      return false;
    },
    direction() {
      return `k-menu-item-${this.root.mode}`;
    }
  },
  beforeMount() {},
  mounted() {},
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
    },
    height: {
      type: String,
      default() {
        return '70';
      }
    },
    className: {
      type: String,
      default() {
        return '';
      }
    },
    align: {
      type: String,
      default() {
        return 'center';
      }
    }
  }
};
</script>

<style lang="less" scoped>
.k-menu-item {
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 500px;
  // text-align: center;
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
    border-radius: 50%;
    z-index: 1;
  }
}
.k-menu-item-row + .k-menu-item-row {
  margin-inline-start: 10px;
}

.k-menu-item-column + .k-menu-item-column {
  margin-block-start: 10px;
}

.current-shape {
  pointer-events: none;
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
