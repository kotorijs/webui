<template>
  <div class="root">
    <Terminal
      name="my-terminal"
      :init-log="[{ content: 'Welcome to kotori console!✋' }]"
      scroll-mode="smooth"
      :show-header="false"
    ></Terminal>
    <pps-form @submit="sendMsg()">
      <pps-input :content.sync="inputData">
        <pps-button theme="confirm">发送</pps-button>
      </pps-input>
    </pps-form>
  </div>
</template>

<script>
import { TerminalApi } from 'vue-web-terminal';
import Ws from '@/utils/webSocket';
export default {
  name: 'myConsole',
  data() {
    return {
      messages: [],
      inputData: '',
      action: 'command'
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
      const state = this.$store.state.console.data || null;
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
        Ws.ws.send({ command: this.inputData, action: this.action });
        this.pushMsg({
          label: ['user'],
          msg: this.inputData
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
        pid: null,
        label: ['INFO'],
        msg: 'nothing'
      };
      let { date, pid, label, msg } = { ...defaultOptions, ...options };
      date = new Date(date).toLocaleString();
      label = label.join(' ');
      const message = `\x1B[34m${date} \x1B[0m(${pid}) \x1B[0m\x1B[1;33m[${label}] \x1B[0m: ${msg}`;
      TerminalApi.pushMessage('my-terminal', { type: 'ansi', content: message });
    }
  },
  mounted() {
    Ws.create();
    this.firstMsg();
  },
  beforeDestroy() {
    this.$store.commit('layoutOption/updateIsFoldAside', false);
  }
};
</script>

<style lang="less">
.root {
  height: calc(100vh - 90px);
}
.t-window {
  border-radius: 10px;
}
.t-last-line {
  display: none;
}
</style>
