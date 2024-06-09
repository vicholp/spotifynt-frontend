import { defineStore } from 'pinia';


export default defineStore('user', {
  actions: {
    setUser(user) {
      this.user = user;
    }
  },
  state: () => ({
    user: null,
  }),
  persist: true,
});
