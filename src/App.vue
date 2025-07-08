<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

import AppSidebar from "@components/layout/AppSidebar.vue";
import AppHeader from "@components/layout/AppHeader.vue";
import { useThemeStore } from "@stores/theme";
import ConfirmPopup from "primevue/confirmpopup";
import Toast from "primevue/toast";
import { useAuthStore } from "@stores/auth";
import { usePermissionStore } from "@stores/permission";
import { apiRequest } from "@composables/common/useApi";

const route = useRoute();
const isSidebarOpen = ref(true);
const themeStore = useThemeStore();
const authStore = useAuthStore();
const permissionStore = usePermissionStore();

// type PermissionsResponse = {
//   permissions: string[];
// };

if (authStore.isAuthenticated) {
  const demoPermission = [
    "manage products",
    "create products",
    "edit products",
    "delete products",
  ];
  permissionStore.setPermissions(demoPermission);
  //const res = await apiRequest<PermissionsResponse>("auth/permissions");
  //permissionStore.setPermissions(res.permissions);
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const showLayout = computed(() => route.path !== "/login");
</script>

<template>
  <div
    :class="{ dark: themeStore.isDark }"
    class="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
  >
    <div v-if="showLayout" class="flex h-screen">
      <AppSidebar :isOpen="isSidebarOpen" />
      <div class="flex flex-col flex-1 overflow-hidden">
        <AppHeader @toggle-sidebar="toggleSidebar" />
        <main class="p-6 flex-1 overflow-y-auto">
          <router-view />
        </main>
      </div>
    </div>

    <!-- Login page or routes without layout -->
    <div v-else class="h-screen">
      <router-view />
    </div>
  </div>

  <Toast />
  <ConfirmPopup />
</template>

<style scoped></style>
