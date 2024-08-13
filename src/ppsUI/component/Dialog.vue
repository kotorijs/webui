<template>
  <transition name="hello">
    <dialog ref="dialog" v-if="dialogFlag">
      <div class="pps-dialog-window">
        <header>
          <slot name="title">{{ title }}</slot>
          <pps-icon icon="pps-icon-close" @click="closeMessageFn()"></pps-icon>
        </header>
        <div class="pps-dialog-content">
          <slot name="content">
            <p>{{ content }}</p>
          </slot>
        </div>
        <footer>
          <slot name="footer">
            <pps-button @click="cancelFn()">取消</pps-button>
            <pps-button theme="confirm" @click="confirmFn()">确认</pps-button>
          </slot>
        </footer>
      </div>
    </dialog>
  </transition>
</template>

<script>
export default {
  name: 'ppsDialog',
  props: {
    show: {
      type: Boolean,
      default() {
        return false;
      }
    },
    handleClick: {
      type: Function
    },
    content: {
      type: String,
      default() {
        return '警告';
      }
    },
    title: {
      type: String,
      default() {
        return '提示';
      }
    },
    afterShow: {
      type: Function,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      dialogFlag: false,
      isShowing: false,
      isClosing: false
    };
  },
  methods: {
    cancelFn() {
      this.closeMessageFn();
      this.$emit('canceled');
    },
    confirmFn() {
      this.closeMessageFn();
      this.$emit('confirmed');
    },
    confirmClick() {
      return new Promise((resolve, reject) => {
        this.closeMessageFn();
        resolve();
      });
    },
    showMessageFn() {
      this.dialogFlag = true;
      this.$nextTick(() => {
        if (this.$refs.dialog) {
          this.$refs.dialog.showModal();
          this.afterShow() && this.afterShow();
        }
      });
    },
    closeMessageFn() {
      if (this.isClosing) return; // 防抖
      this.isClosing = true;
      this.dialogFlag = false;
      setTimeout(() => {
        this.isClosing = false;
        try {
          this.$refs.dialog.close();
        } catch (error) {}
      }, 300);
    },
    handleMessageFn(isShow) {
      isShow ? this.showMessageFn() : this.closeMessageFn();
    }
  },
  watch: {
    dialogFlag() {
      this.$emit('update:show', this.dialogFlag);
    },
    show(newVal, oldVal) {
      this.handleMessageFn(newVal);
    }
  },
  mounted() {
    if (this.show) {
      this.showMessageFn();
    }
  }
};
</script>

<style lang="less">
dialog {
  position: absolute;
  min-width: 360px;
  min-height: 100px;
  max-height: calc(100vh - 100px);
  border: none;
  border-radius: 4px;
  transition: 0.15s linear;
  overflow: hidden;

  @media screen and (max-width: 510px) {
    min-width: 300px;
  }

  &::backdrop {
    background: rgba(0, 0, 0, 0.5);
  }

  .pps-dialog-window {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0;
      font-size: 18px;
    }

    .pps-dialog-content {
      margin-top: 20px;
      max-height: 70vh;
      height: 100%;
      overflow-x: auto;

      &::-webkit-scrollbar {
        width: 5px; // 设置滚动条的宽度
        height: 0px;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
        width: 5px;
      }
      &::-webkit-scrollbar-thumb {
        position: absolute;
        right: -5px;
        width: 5px;
        background: #88888870;
        border-radius: 6px;
      }
      &::-webkit-scrollbar-thumb:hover {
        background: #888888; // 鼠标悬停时滚动条的颜色
      }
    }

    footer {
      position: sticky;
      bottom: 0;
      align-self: flex-end;
      margin-top: 20px;
      .pps-button {
        border-radius: 4px;
        max-width: 60px;
      }
    }
  }
}
/* 进入的起点、离开的终点 */
.hello-enter,
.hello-leave-to {
  transform: translateY(-10%);
}
/* 进入的终点、离开的起点 */
.hello-enter-to,
.hello-leave {
  transform: translateY(0);
}
</style>
