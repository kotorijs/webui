import Vue from 'vue';
import { Message } from 'element-ui';
import config from '@/config';
import store from '@/store';

const HOST = config.host || 'localhost';
const PORT = config.port || 721;
const url = `ws://${HOST}:${PORT}/webui`;

Vue.prototype.$message = Message;

// function handleMessage(message) {
//   let msg = message.replaceAll('\n', '<br />');
//   const matches = msg.matchAll(/\[(.*?),(.*?)\]/g);

//   for (const val of matches) {
//     switch (val[1]) {
//       case 'at':
//         msg = msg.replace(val[0], `@${store.state.user[val[2]].name ?? val[2]} `);
//         break;
//       case 'image':
//         msg = msg.replace(
//           val[0],
//           /* html */ `<img src="${val[2]}" style="max-height: 350px"/>`
//         );
//         break;
//       case 'record':
//         msg = msg.replace(
//           val[0],
//           /* html */ `<audio controls src="${val[2]}"></audio>`
//         );
//         break;
//       case 'video':
//         msg = msg.replace(
//           val[0],
//           /* html */ `<video controls style="max-height: 350px" src="${val[2]}"></video>`
//         );
//         break;
//     }
//   }
//   return msg;
// }

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

  send(data) {
    this.server.send(JSON.stringify(data));
  }

  onOpen() {
    Vue.prototype.$message.success('WebSocket 服务器连接成功');
    this.status = 'online';
    // this.send({ selfId: store.state.sand.bot });
  }

  onMessage(msg) {
    const data = JSON.parse(msg.data);
    if (data.type === 'console_output') {
      store.commit('updateConsole', data);
    } else if (data.type === 'stats') {
      store.commit('updateStats', data);
    }
  }

  onError(error) {
    Vue.prototype.$message.error(`WebSocket 发生错误：${String(error)}`);
    console.log(error);
  }

  onClose(code) {
    Vue.prototype.$message.warning(`WebSocket 服务器已断开，Code:${code.code}`);
    this.status = 'offline';
    store.commit('updateStats');
    store.commit('updateConsole');
  }

  static create() {
    if (this.ws) this.ws.server.close();
    this.ws = new Ws();
  }
}
