// 群组类
export default class Group {
  constructor({ name, id, lord }) {
    this.id = `group-${id}`;
    this.name = name;
    this.lord = lord;
    this.messages = [];
    this.members = []
  }

  getAllMembers() {
    return this.members;
  }

  addMember(user) {
    this.members.push(user)
  }

  removeMember(id) {
    this.members = this.members.filter((member) => member.id !== id);
  }

  sendMessage() {}

  deleteMessage() {}

  getMessages() {}
}
