import store from '@/store';

let wsInstance = null;

export default {
  install(Vue) {
    const wsBus = new Vue();

    Vue.prototype.$ws = {};

    Vue.prototype.$ws.init = () => {
      const host = store.state.layoutOption.wsHost;
      const token = store.state.layoutOption.token;
      const url = `${host}/webui/${token}`;
      if (wsInstance) return console.warn('WebSocket已经开启，不能重复初始化。');
      wsInstance = new WebSocket(url);
      Vue.prototype.$ws.instance = wsInstance;
      wsInstance.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        wsBus.$emit('wsMessage', data);
      };
      wsInstance.onopen = () => {
        Vue.prototype.$message.success('WebSocket 服务器连接成功');
      };
      wsInstance.onclose = (code) => {
        Vue.prototype.$message.warning(`WebSocket 服务器已断开，Code:${code.code}`);
        store.commit('webSocketOption/updateCpu');
        store.commit('webSocketOption/updateRam');
      };
      wsInstance.onerror = (error) => {
        Vue.prototype.$message.error(`WebSocket 发生错误：${String(error)}`);
      };
    };

    Vue.prototype.$ws.close = () => {
      if (wsInstance) {
        wsInstance.close();
        wsInstance = null;
      }
    };
    Vue.prototype.$ws.bus = wsBus;
  }
};
