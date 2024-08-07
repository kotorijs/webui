
import store from "@/store";
// 群组类
export default class Group {
  constructor({ name, id, lord }) {
    this.id = `group-${id}`;
    this.name = name;
    this.lord = `user-${lord}`;
    this.admins = []
    this.members = []
    store.commit('sandBox/ADD_GROUP', this);
    store.commit('sandBox/CREATE_GROUP_MESSAGE', this);
  }

  getAllMembers() {
    return this.members;
  }

  addMember(user) {
    // console.log(user);
    this.members.push(user)
  }

  removeMember(id) {
    this.members = this.members.filter((member) => member.id !== id);
  }
}
