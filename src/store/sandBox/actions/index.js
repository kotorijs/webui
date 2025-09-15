import Vue from 'vue';
import wsBus from '@/utils/sandBox/wsBus';
import { Notification } from 'element-ui';
const WS_STRING = 'webSocket';
const SB_STRING = '<strong class="success-text">sandBox</strong>';

export default {
  initWebSocket({ commit, state, rootState }) {
    if (state.wsConnection) return;

    const host = rootState.layoutOption.host;
    const port = rootState.layoutOption.port;
    const protocol = rootState.layoutOption.protocol;
    const url = `${protocol === 'https://' ? 'wss' : 'ws'}://${host}:${port}/adapter/sandbox`;
    const ws = new WebSocket(url);

    // 保存连接实例
    commit('SET_WS_CONNECTION', ws);
    commit('SET_CONNECTION_STATUS', 'connecting');

    ws.onopen = () => {
      commit('SET_CONNECTION_STATUS', 'connected');
      Notification.success({
        title: WS_STRING,
        message: `${SB_STRING} 连接成功`,
        dangerouslyUseHTMLString: true,
        duration: 5000
      });
    };

    ws.onerror = (error) => {
      commit('SET_CONNECTION_STATUS', 'error');
      console.error('WebSocket 错误:', error);
      Notification.error({
        title: WS_STRING,
        message: `${SB_STRING} 发生错误：${String(error)}`,
        dangerouslyUseHTMLString: true
      });
    };

    ws.onclose = (code) => {
      commit('SET_CONNECTION_STATUS', 'disconnected');
      Notification.warning({
        title: WS_STRING,
        message: `${SB_STRING} 已断开，Code:${code.code}`,
        dangerouslyUseHTMLString: true
      });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        wsBus.$emit('onmessage', data);
      } catch (error) {
        console.error('消息转化错误:', error);
      }
    };
  },
  send(context, payload) {
    const { state, dispatch } = context;
    if (state.wsStatus !== 'connected') {
      Vue.prototype
        .$dialog({ title: '提示', content: 'SandBox webSocket已断开连接，是否重新连接？' })
        .then(() => {
          dispatch('initWebSocket');
        })
        .catch(() => {
          Vue.prototype.$message.warn('取消重新连接');
        });
      return;
    }

    state.wsInstance.send(JSON.stringify(payload));
  },
  close({ state }) {
    state.wsInstance.close();
  }
};
