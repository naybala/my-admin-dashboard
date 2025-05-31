// src/App.vue
<script setup lang="ts">
import { ref } from "vue";
import AppSidebar from "./components/layout/AppSidebar.vue";
import AppHeader from "./components/layout/AppHeader.vue";
import { useThemeStore } from "./stores/theme";

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
    <div class="flex">
      <AppSidebar :isOpen="isSidebarOpen" />
      <div
        :class="{ '': isSidebarOpen, 'ml-0': !isSidebarOpen }"
        class="flex-1 transition-all duration-300"
      >
        <AppHeader @toggle-sidebar="toggleSidebar" />
        <main class="p-6">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
