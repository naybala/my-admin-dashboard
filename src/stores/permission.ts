import { defineStore } from 'pinia';

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    permissions: new Set<string>(),
  }),
  actions: {
    setPermissions(perms: string[]) {
      this.permissions = new Set(perms);
    },
    clearPermissions() {
      this.permissions.clear();
    },
  },
  getters: {
    hasPermission: (state) => (key: string) => {
      return state.permissions.has(key);
    },
  },
});
