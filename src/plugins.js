import store from '@/store';

let wsInstance = null;
const WS_STRING = 'webSocket';
const CSL_STRING = '<strong class="info-text">console</strong>';

export default {
  install(Vue) {
    const wsBus = new Vue();

    Vue.prototype.$ws = {};

    Vue.prototype.$ws.init = (task) => {
      const final_host = store.state.layoutOption.host;
      const final_port = store.state.layoutOption.port;
      const final_protocol = store.state.layoutOption.protocol;
      const token = store.state.layoutOption.token;
      const url = `${
        final_protocol === 'https://' ? 'wss:' : 'ws:'
      }//${final_host}:${final_port}/webui/${token}`;
      if (wsInstance) return console.warn('WebSocket已经开启，不能重复初始化。');
      wsInstance = new WebSocket(url);
      task && task();
      Vue.prototype.$ws.instance = wsInstance;

      // 监听消息
      wsInstance.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        wsBus.$emit('wsMessage', data);
      };
      // 监听连接成功
      wsInstance.onopen = () => {
        Vue.prototype.$notify.success({
          title: WS_STRING,
          dangerouslyUseHTMLString: true,
          message: `${CSL_STRING} 连接成功`,
          duration: 5000
        });
      };
      // 监听连接关闭
      wsInstance.onclose = (code) => {
        Vue.prototype.$notify.warning({
          title: WS_STRING,
          dangerouslyUseHTMLString: true,
          message: `${CSL_STRING} 已断开，Code:${code.code}`,
          duration: 5000
        });
        if (wsInstance) wsInstance = null;
        store.commit('webSocketOption/updateCpu');
        store.commit('webSocketOption/updateRam');
      };
      // 监听连接错误
      wsInstance.onerror = (error) => {
        console.log(error);
        Vue.prototype.$notify.error({
          message: `${CSL_STRING} 连接错误：${String(error)}`,
          dangerouslyUseHTMLString: true,
          duration: 5000
        });
      };
    };

    Vue.prototype.$ws.close = () => {
      console.log('wsclose');
      if (wsInstance) {
        wsInstance.close();
        wsInstance = null;
      }
    };
    Vue.prototype.$ws.bus = wsBus;
  }
};
