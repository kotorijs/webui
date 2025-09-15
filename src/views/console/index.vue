<template>
  <div class="root">
    <div class="k-console">
      <Terminal
        name="my-terminal"
        :init-log="[{ content: 'Welcome to kotori console!✋' }]"
        scroll-mode="smooth"
        :show-header="false"
      ></Terminal>
    </div>

    <pps-form @submit="sendMsg()" @reset="clearMsg()">
      <pps-input :content.sync="inputData">
        <pps-button theme="confirm">发送</pps-button>
        <pps-button theme="primary" type="reset">清屏</pps-button>
      </pps-input>
    </pps-form>
  </div>
</template>

<script>
import { Colors, TerminalAdapter } from '@kotori-bot/tools';
import { TerminalApi } from 'vue-web-terminal';
export default {
  name: 'kConsole',
  data() {
    return {
      messages: [],
      inputData: '',
      action: 'command',
      color: null,
      loggerLevelMap: {
        10: 'TRACE',
        20: 'DEBUG',
        25: 'LOG',
        30: 'INFO',
        40: 'WARN',
        50: 'ERROR',
        60: 'FATAL',
        70: 'SILENT'
      }
    };
  },
  methods: {
    onExecCmd(key, command, success, failed) {
      if (key === 'fail') {
        failed('Something wrong!!!');
      } else {
        const allClass = ['success', 'error', 'system', 'info', 'warning'];
        const clazz = allClass[Math.floor(Math.random() * allClass.length)];
        success({
          type: 'normal',
          class: clazz,
          tag: '成功',
          content: command
        });
      }
    },
    handleClick() {
      console.log('click');
    },
    firstMsg() {
      const state = this.$store.state.webSocketOption.console.data || null;
      if (!state) {
        return this.$message({
          type: 'error',
          message: '未获取到数据，检查后端是否开启！'
        });
      }
      this.pushMsg({
        date: new Date(state.time),
        pid: state.pid,
        label: state.label,
        msg: state.msg
      });
    },
    sendFn(wsMsg) {
      try {
        this.$ws.instance.send(JSON.stringify(wsMsg));
      } catch (error) {
        return this.$message({
          type: 'error',
          message: `未连接后端，请检查后端是否开启！${error}`
        });
      }
      this.pushMsg({
        label: ['user'],
        msg: this.inputData
      });
    },
    sendMsg() {
      if (!this.$ws.instance) {
        this.$ws.init();
      }
      const wsMsg = { command: this.inputData, action: this.action };
      // console.log(this.$ws.instance);
      if (this.$ws.instance.readyState === 0) {
        this.$nextTick(() => {
          this.sendFn(wsMsg);
        });
      } else if (this.$ws.instance.readyState === 2) {
        // this.sendFn(wsMsg);
        this.$message.error('连接正在关闭，请重新连接');
      } else if (this.$ws.instance.readyState === 3) {
        this.$message.error('重新连接中...');
        this.$ws.init(this.sendFn(wsMsg));
      } else {
        this.sendFn(wsMsg);
      }

      this.inputData = '';
    },
    pushMsg(options) {
      const defaultOptions = {
        date: new Date(),
        label: ['bot'],
        msg: 'nothing',
        level: '30'
      };
      let { date, label, msg, level } = { ...defaultOptions, ...options };
      date = new Date(date).toLocaleString();
      label = label.join(' ');
      const message = `\x1B[34m${date} \x1B[0m\x1B[1;33m[${
        this.loggerLevelMap[level]
      }] \x1B[0m(${label}): \x1B[0m ${this.color.parse(msg)}`;
      this.$nextTick(() => {
        TerminalApi.pushMessage('my-terminal', { type: 'ansi', content: message });
      });
    },
    clearMsg() {
      TerminalApi.clearLog('my-terminal');
    }
  },
  computed: {},
  created() {
    this.color = new Colors(new TerminalAdapter());
  },
  mounted() {
    this.$ws.bus.$on('wsMessage', (msg) => {
      if (msg.type === 'console_output') {
        this.pushMsg(msg.data);
      }
    });
  },
  activated() {},
  deactivated() {
    this.$store.commit('layoutOption/updateIsFoldAside', false);
  },
  beforeDestroy() {
    this.$ws.bus.$off('wsMessage');
    this.$store.commit('layoutOption/updateIsFoldAside', false);
  },
  updated() {}
};
</script>

<style scoped lang="less">
.root {
  height: 100%;
  width: 100%;
  position: relative;
  .k-console {
    height: 100%;
  }
  .t-container {
    border-radius: 0;
  }
  &::v-deep .t-window {
    height: calc(100% - 50px) !important;

    .t-last-line {
      display: none;
    }
  }
}
.pps-form {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  width: 98%;
  margin: 0 auto;
  z-index: 1;
  justify-content: space-around;
  &::v-deep .pps-input-inner {
    width: 100%;
  }
}
</style>
