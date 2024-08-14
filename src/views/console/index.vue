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
      color: null
    };
  },
  inject: ['layout'],
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
    sendMsg() {
      try {
        this.layout.ws.send({ command: this.inputData, action: this.action }, () => {
          this.pushMsg({
            label: ['user'],
            msg: this.inputData
          });
        });
        this.inputData = '';
      } catch (error) {
        return this.$message({
          type: 'error',
          message: `未连接后端，请检查后端是否开启！${error}`
        });
      }
    },
    pushMsg(options) {
      const defaultOptions = {
        date: new Date(),
        pid: '本机',
        label: ['INFO'],
        msg: 'nothing'
      };
      let { date, pid, label, msg } = { ...defaultOptions, ...options };
      date = new Date(date).toLocaleString();
      label = label.join(' ');
      const message = `\x1B[34m${date} \x1B[0m(${pid}) \x1B[0m\x1B[1;33m[${label}] \x1B[0m: ${this.color.parse(
        msg
      )}`;
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
    this.$nextTick(() => {
      this.layout.ws.server.onmessage = (msg) => {
        const res = JSON.parse(msg.data);
        if (res.type === 'console_output') {
          this.pushMsg(res.data);
        }
      };
    });
  },
  activated() {},
  deactivated() {
    this.$store.commit('layoutOption/updateIsFoldAside', false);
  },
  beforeDestroy() {
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
  &::v-deep .pps-input {
    width: 100%;
  }
}
</style>
