<script setup lang="ts">
import { ref } from "vue";
import AppSidebar from "./components/layout/AppSidebar.vue";
import AppHeader from "./components/layout/AppHeader.vue";
import { useThemeStore } from "./stores/theme";
import ConfirmPopup from "primevue/confirmpopup";

const isSidebarOpen = ref(true);
const themeStore = useThemeStore();

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<template>
  <div
    :class="{ dark: themeStore.isDark }"
    class="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
  >
    <div class="flex h-screen">
      <AppSidebar :isOpen="isSidebarOpen" />

      <div class="flex flex-col flex-1 overflow-hidden">
        <AppHeader @toggle-sidebar="toggleSidebar" />
        <main class="p-6 flex-1 overflow-y-auto">
          <router-view />
        </main>
      </div>
    </div>
  </div>
  <ConfirmPopup></ConfirmPopup>
</template>

<style scoped>
/* Any App.vue specific styles */
</style>
