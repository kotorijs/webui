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
      // TerminalApi.focus('my-terminal', true);
    },
    pushMsg() {
      const state = this.$store.state.console.data || null;
      if (!state) {
        return this.$message({
          type: 'error',
          message: '未获取到数据，检查后端是否开启！'
        });
      }

      const log_level = state.label.join(' ');
      const date = new Date(state.time);
      const dateString = date.toLocaleString();
      const message = `\x1B[34m${dateString} \x1B[0m(${state.pid}) \x1B[0m\x1B[1;33m[${log_level}] \x1B[0m: ${state.msg}`;

      this.messages.push({ type: 'ansi', content: message });
      TerminalApi.pushMessage('my-terminal', { type: 'ansi', content: message });
    },
    sendMsg() {
      Ws.ws.send({ command: this.inputData, action: this.action });
    }
  },
  mounted() {
    this.$store.commit('updateIsFoldAside', true);
    Ws.create();
    this.pushMsg();
  },
  beforeDestroy() {
    this.$store.commit('updateIsFoldAside', false);
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
