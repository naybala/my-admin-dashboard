<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

import AppSidebar from "@components/layout/AppSidebar.vue";
import AppHeader from "@components/layout/AppHeader.vue";
import { useThemeStore } from "@stores/theme";
import ConfirmPopup from "primevue/confirmpopup";
import Toast from "primevue/toast";
import { useAuthStore } from "@stores/auth";
import { usePermissionStore } from "@stores/permission";
import { apiRequest } from "@composables/common/useApi";
import { useRouter } from "vue-router";
import Loader from "@components/common/Loader.vue";

const route = useRoute();
const isSidebarOpen = ref(true);
const themeStore = useThemeStore();
const authStore = useAuthStore();
const permissionStore = usePermissionStore();

const router = useRouter();
// const routeLoading = ref(false);
// router.beforeEach((to, from, next) => {
//   routeLoading.value = true;
//   next();
// });

// router.afterEach(() => {
//   setTimeout(() => {
//     routeLoading.value = false;
//   }, 300);
// });

// const globalLoading = computed(() => routeLoading.value);

// type PermissionsResponse = {
//   permissions: string[];
// };

onMounted(() => {
  watch(
    () => authStore.isAuthenticated,
    (isAuth) => {
      if (isAuth && !permissionStore.ready) {
        // Simulate or fetch permissions
        const demoPermission = [
          "manage products",
          "create products",
          "edit products",
          "delete products",
          "manage roles",
          "create roles",
          "edit roles",
          "delete roles",
        ];
        permissionStore.setPermissions(demoPermission);
        // Optionally fetch from API:
        // const res = await apiRequest<PermissionsResponse>("auth/permissions");
        // permissionStore.setPermissions(res.permissions);
      }
    },
    { immediate: true } // triggers immediately on load
  );
});

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
          <!-- <div v-if="globalLoading" class="text-center text-gray-500">
            <Loader />
          </div>
          <div v-else>
            <router-view />
          </div> -->
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
