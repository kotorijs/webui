<template>
  <div class="table-item">
    <slot v-if="title" name="title">
      <span class="item-title">{{ title.title }}</span>
    </slot>
    <slot name="content"><span class="item-content" v-html="content"></span></slot>
    <!-- 展开气泡 -->
    <template v-if="0">
      <span
        class="item-content toast"
        :class="{ isChecked: this.showFlag }"
        title="点击查看全部"
        @click="showToast()"
      >
        {{ content }}
      </span>

      <!-- 气泡 -->
      <span ref="toast" v-show="showFlag" class="item-content-hidden">
        <span>{{ content }}</span>
        <i></i>
        <strong @click="closeToast()" title="关闭">×</strong>
      </span>
    </template>
    <!-- <hr /> -->
  </div>
</template>

<script>
export default {
  name: 'ppsTableItem',
  props: {
    title: {
      type: Boolean,
      required: false,
      default() {
        return false;
      }
    },
    content: {
      default() {
        return '无';
      }
    },
    test: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      showFlag: false
    };
  },
  methods: {
    showToast() {
      this.showFlag = !this.showFlag;
    },
    closeToast() {
      this.showFlag = false;
    }
  }
};
</script>

<style lang="scss">
.isChecked {
  filter: brightness(95%);
}
.isChecked::before {
  content: '正在查看全部';
  padding-left: 60px;
  padding-right: 60px;
  color: blue;
}
.item-content span {
  display: block;
  width: 80px;
  margin: auto;
  text-align: center;
  border-radius: 5px;
}
.item-content:hover {
  filter: brightness(95%);
}
.item-content-hidden {
  position: absolute;
  left: 100px;
  bottom: 40px;
  width: auto;
  min-width: 80px;
  max-width: 200px;
  padding: 2px;
  color: #2e2e2e;
  font-size: 13px;
  border: 1px solid #eabf32;
  border-radius: 8px;
  background-color: #eabf32;
  z-index: 2;
}
.item-content-hidden span {
  display: inline-block;
  width: fit-content;
}
.item-content-hidden i {
  position: absolute;
  bottom: -15px;
  left: 10px;
  width: 0;
  height: 0;
  border: 10px solid #ecbc20;
  border-left-color: transparent;
  border-right-color: transparent;
  border-bottom-color: transparent;
}
.item-content-hidden strong {
  position: absolute;
  top: -8px;
  right: -8px;
  cursor: pointer;
  width: 20px;
  height: 20px;
  line-height: 20px;
  color: #e2e2e2;
  background-color: #2e2e2e;
  text-align: center;
  vertical-align: text-top;
  border: 1px solid #e2e2e2;
  border-radius: 50%;
}

.table-item {
  display: flex;
  justify-content: center;
  min-height: 25px;
  margin: 0 10px 5px 10px;
  border-bottom: 1px solid#e2e2e2;
}
.item-title {
  min-width: 64px;
  margin-left: 15px;
  text-align-last: justify;
}
.item-content {
  flex-grow: 1;
  margin-left: 15px;
}
</style>
