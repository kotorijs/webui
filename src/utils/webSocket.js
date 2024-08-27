import Vue from 'vue';
import { Message } from 'element-ui';
import config from '@/config';
import store from '@/store';

const wsHost = config.wsHost ?? '';
const url = `${wsHost}/webui/${store.state.layoutOption.token}`;

Vue.prototype.$message = Message;

export default class Ws {
  constructor() {
    this.status = 'offline';
    this.server = new WebSocket(url);
    this.server.onopen = this.onOpen.bind(this);
    this.server.onmessage = this.onMessage.bind(this);
    this.server.onerror = this.onError.bind(this);
    this.server.onclose = this.onClose.bind(this);
  }

  static ws;

  send(data, task) {
    task && task(data);
    this.server.send(JSON.stringify(data));
  }

  onOpen() {
    Vue.prototype.$message.success('WebSocket 服务器连接成功');
    this.status = 'online';
    // this.send({ selfId: store.state.sand.bot });
  }

  onMessage(msg) {
    const data = JSON.parse(msg.data);
    const res = data.data;
    if (data.type === 'stats') {
      store.commit('webSocketOption/updateCpu', res.cpu);
      store.commit('webSocketOption/updateRam', res.ram);
    }
  }

  onError(error) {
    Vue.prototype.$message.error(`WebSocket 发生错误：${String(error)}`);
    console.log(error);
  }

  onClose(code) {
    Vue.prototype.$message.warning(`WebSocket 服务器已断开，Code:${code.code}`);
    this.status = 'offline';
    store.commit('webSocketOption/updateCpu');
    store.commit('webSocketOption/updateRam');
  }

  static create() {
    if (this.ws) this.ws.server.close();
    this.ws = new Ws();
  }
}
