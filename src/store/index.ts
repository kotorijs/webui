import { defineStore } from 'pinia';

interface storeStateType {
  state: {
    aside: null | boolean;
  };
  token: string;
}

/* 定义容器 */
export const useMainStore = defineStore('main', {
  state: (): storeStateType => {
    return {
      state: {
        aside: null
      },
      token: ''
    };
  },

  persist: {
    storage: localStorage
  },

  getters: {},

  actions: {
    changeStateAside() {
      this.state.aside = !this.state.aside;
    }
  }
});
