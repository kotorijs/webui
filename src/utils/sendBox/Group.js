// 群组类
export default class Group {
  constructor({ name, id, lord }) {
    this.id = `group-${id}`;
    this.name = name;
    this.lord = lord;
    this.messages = [];
    this.members = new Map();
  }

  getAllMembers() {}

  addMember(userId, user) {
    this.members.set(userId, user);
  }

  removeMember() {}

  sendMessage() {}

  deleteMessage() {}

  getMessages() {}
}
