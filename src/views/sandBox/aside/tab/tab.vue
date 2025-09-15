<template>
  <div class="k-tab-wrapper" @updateTab="changeTabFn">
    <div
      ref="tab-item"
      @click="changeTabFn(index)"
      v-for="(tab, index) in tabs"
      :key="index"
      class="k-tab-item"
    >
      <div class="k-tab-font" :class="{ 'k-tab-current': current === index }">{{ tab }}</div>
    </div>
    <div class="tab-thumb" ref="tab-thumb" :style="{ left: x + 'px', top: y + 'px' }">
      <slot name="thumb"><div class="k-tab-thumb"></div></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'k-tab',
  props: {
    tabs: {
      type: Array,
      default() {
        return [];
      }
    },
    defaultActive: {
      type: Number,
      default() {
        return 0;
      }
    }
  },
  data() {
    return {
      x: 0,
      y: 0,
      current: 0
    };
  },
  methods: {
    changeTabFn(tab = 0) {
      this.$emit('changeTab', tab);
      this.current = tab;
      const { offsetLeft, offsetTop } = this.$refs['tab-item'][tab];
      this.x = offsetLeft;
      this.y = offsetTop;
    }
  },
  mounted() {
    this.changeTabFn(this.defaultActive);
  }
};
</script>

<style lang="less">
.k-tab-wrapper {
  display: flex;
  position: relative;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background-color: #eeeeee;
  // width: 140px;
  width: auto;
  padding: 0 5px;
  height: 35px;
  border-radius: 5px;

  .k-tab-item {
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
    z-index: 1;
    user-select: none;

    .k-tab-font {
      //   border: 1px solid #000;
      text-align: center;
      width: 60px;
      height: 27px;
      line-height: 27px;
      color: #7a7a7a;

      &:not(.k-tab-current):hover {
        color: #a0a0a0;
      }

      &:not(.k-tab-current):active {
        color: #c2c2c2;
      }
    }
    .k-tab-current {
      color: #752bec;
    }
  }

  .k-tab-thumb {
    position: absolute;
    background-color: #fff;
    width: 60px;
    height: 27px;
    border-radius: 3px;
    pointer-events: none;
  }
  .tab-thumb {
    height: 100%;
    position: absolute;
    transition: all 0.15s ease;
  }
}
</style>
