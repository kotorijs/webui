import store from '@/store';
// 群组类
/**
 * @description: 群组类
 * @param {*} name 群名
 * @param {*} id 群号
 * @param {*} lord 群主id
 * @param {*} avatar 群头像
 */
export default class Group {
  constructor({ name, numId, id, lord, avatar }) {
    this.id = id || `group-${numId}`;
    this.numId = numId || this.self().numId;
    this.name = name || this.self().name;
    this.lord = lord || this.self().lord;
    this.avatar = avatar || `https://k.hotaru.icu/api/data/avatar/${name}`;
    this.admins = this.self().admins || [];
    this.members = this.self().members || [];
  }

  mount() {
    store.commit('sandBox/ADD_GROUP', this);
    store.commit('sandBox/CREATE_GROUP_MESSAGE', this);
    return this;
  }

  getAllMember() {
    return this.self().members.map(({ id, role }) => {
      const user = store.getters['sandBox/getUserById'](id);
      return { ...user, role };
    });
  }

  getMemberById(id) {
    return this.getAllMember().find((member) => member.id === id) || null;
  }

  getAllMessage() {
    return store.getters['sandBox/getGroupMessage'](this.id);
  }

  addMember({ uid, role }) {
    store.commit('sandBox/ADD_MEMBER', { gid: this.id, uid, role });
  }

  removeMember(id) {
    store.commit('sandBox/REMOVE_MEMBER', { gid: this.id, uid: id });
  }

  self() {
    return store.getters['sandBox/getGroupById'](this.id);
  }
}
