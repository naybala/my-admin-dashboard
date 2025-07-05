import  Cookies  from 'js-cookie';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: Cookies.get('auth-token') || null,
   
  }),

  actions: {
    checkAuth() {
      this.token = Cookies.get('auth-token') || null;
    
    },

    setToken(newToken: string) {
      this.token = newToken;
      Cookies.set('auth-token', newToken, {
        expires: 7,
        secure: true,
        sameSite: 'strict',
      });
    },

    clearToken() {
      this.token = null;
      Cookies.remove('auth-token');
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
  },
});
