<template>
  <transition name="pps-dialog">
    <dialog ref="dialog" v-if="dialogFlag">
      <div class="pps-dialog-window">
        <header>
          <slot name="title">{{ title }}</slot>
          <pps-icon icon="pps-icon-close" @click="handleAction('close')"></pps-icon>
        </header>
        <div class="pps-dialog-content">
          <slot name="content">
            <p>{{ content }}</p>
          </slot>
        </div>
        <footer>
          <slot name="footer">
            <pps-button @click="handleAction('cancel')">取消</pps-button>
            <pps-button theme="confirm" @click="handleAction('confirm')">确认</pps-button>
          </slot>
        </footer>
      </div>
    </dialog>
  </transition>
</template>

<script>
export default {
  name: 'ppsDialog',
  data() {
    return {
      dialogFlag: false,
      isShowing: false,
      isClosing: false,
      action: ''
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
    handleAction(action) {
      this.action = action;
      this.closeMessageFn();
      if (this.show) {
        this.action === 'confirm' && this.$emit('confirmed');
        ['cancel', 'close'].includes(this.action) && this.$emit('canceled');
      }
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
      if (this.isClosing) return; // 节流
      this.isClosing = true;
      this.dialogFlag = false;
      setTimeout(() => {
        this.isClosing = false;
        try {
          if (this.action) this.callback(this.action);
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
  },
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
    },
    callback: {
      type: Function,
      default() {
        return false;
      }
    }
  }
};
</script>
