// 消息类
export class Message {
  constructor(sender, content) {
    this.content = content;
    this.senderId = sender;
    this.time = new Date();
  }
}
