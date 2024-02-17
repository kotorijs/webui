import { useMainStore } from '@/store';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';

function handleMessage(message: string) {
  let msg = message.replaceAll('\n', '<br />');
  for (const val of msg.matchAll(/\[(.*?),(.*?)\]/g)) {
    switch (val[1]) {
      case 'at':
        msg = msg.replace(val[0], `@${useMainStore().getUser(Number(val[2]))?.name ?? val[2]} `);
        break;
      case 'image':
        msg = msg.replace(val[0], /* html */ `<img src="${val[2]}" style="max-height: 350px"/>`);
        break;
      case 'record':
        msg = msg.replace(val[0], /* html */ `<audio controls src="${val[2]}"></audio>`);
        break;
      case 'video':
        msg = msg.replace(val[0], /* html */ `<video controls style="max-height: 350px" src="${val[2]}"></video>`);
        break;
    }
  }
  return msg;
}

export class Ws {
  private readonly server;

  static readonly status = ref<'online' | 'offline'>('offline');

  send(data: object) {
    this.server.send.bind(this.server)(JSON.stringify(data));
  }

  private constructor() {
    this.server = new WebSocket(useMainStore().sand.address);
    this.server.onopen = () => {
      ElMessage.success('WebSocket 服务器连接成功');
      this.send({ selfId: useMainStore().sand.bot });
      Ws.status.value = 'online';
    };
    this.server.onerror = (error) => {
      ElMessage.error(`WebSocket 发生错误：${String(error)}`);
      console.log(error);
    };
    this.server.onclose = (code) => {
      ElMessage.warning(`WebSocket 服务器已断开，Code:${code.code}`);
      Ws.status.value = 'offline';
    };
    this.server.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      const { message, userId, groupId } = data.params;
      const store = useMainStore();
      const handle = handleMessage(message);
      if (data.action === 'send_private_msg') {
        store.sendMsg(handle, userId, store.sand.bot);
      } else if (data.action === 'send_group_msg') {
        store.sendMsg(handle, groupId, store.sand.bot);
      }
    };
  }
  static ws: Ws;

  static create() {
    if (this.ws) this.ws.server.close();
    this.ws = new Ws();
  }
}

export default Ws;
