import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
  }),

  actions: {
    setToken(newToken: string) {
      this.token = newToken;
    },

    clearToken() {
      this.token = null;
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  persist: {
    storage: sessionStorage, 
  },
});

