<template>
  <transition name="hello">
    <dialog ref="dialog" v-if="dialogFlag">
      <div class="window">
        <header>
          {{ content.title }}
          <pps-icon @click.native="closeMessageFn()"></pps-icon>
        </header>
        <div class="content">
          <p>{{ content.message }}</p>
        </div>
        <footer>
          <pps-button @click="cancelFn()">取消</pps-button>
          <pps-button theme="confirm" @click="confirmFn()">确认</pps-button>
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
      type: Object,
      default() {
        return { title: '提示', message: '警告' };
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
    // beforeCloseFn() {
    //   if (typeof this.handleClick === 'function') {
    //     this.handleClick(this.closeMessageFn);
    //   } else {
    //     this.closeMessageFn();
    //   }
    // },
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

<style lang="less" scope>
dialog {
  min-width: 360px;
  min-height: 100px;
  border: none;
  border-radius: 4px;
  transition: 0.15s linear;

  @media screen and (max-width: 510px) {
    min-width: 300px;
  }

  &::backdrop {
    background: rgba(0, 0, 0, 0.5);
  }

  .window {
    display: flex;
    flex-direction: column;
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0;
      font-size: 18px;
    }

    .content {
      min-height: 60px;
      line-height: 60px;
    }

    footer {
      align-self: flex-end;
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
