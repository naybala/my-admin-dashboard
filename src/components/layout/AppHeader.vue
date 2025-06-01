<script setup lang="ts">
import { useThemeStore } from "../../stores/theme";
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import Button from "primevue/button";
import InputText from "primevue/inputtext"; // Example PrimeVue component
import Menubar from "primevue/menubar"; // For language selection or user menu

const emit = defineEmits(["toggle-sidebar"]);
const themeStore = useThemeStore();
const { locale } = useI18n();

const items = ref([
  {
    label: "Languages",
    icon: "pi pi-language",
    items: [
      {
        label: "English",
        command: () => {
          locale.value = "en";
        },
      },
      {
        label: "Myanmar",
        command: () => {
          locale.value = "mm";
        },
      },
    ],
  },
]);
</script>

<template>
  <header
    class="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center transition-colors duration-300"
  >
    <div class="flex items-center space-x-4">
      <Button
        icon="pi pi-bars"
        severity="secondary"
        text
        rounded
        aria-label="Toggle Sidebar"
        @click="emit('toggle-sidebar')"
      />
      <h1 class="text-2xl font-semibold">{{ $t("dashboardTitle") }}</h1>
    </div>

    <div class="flex items-center space-x-4">
      <InputText
        placeholder="Search..."
        class="p-inputtext-sm dark:bg-gray-700 dark:text-white"
      />

      <Button
        :icon="themeStore.isDark ? 'pi pi-sun' : 'pi pi-moon'"
        severity="secondary"
        text
        rounded
        aria-label="Toggle Theme"
        @click="themeStore.toggleTheme"
      />

      <Menubar :model="items" class="p-menubar-light dark:p-menubar-dark" />
    </div>
  </header>
</template>

<style scoped>
/* Adjust PrimeVue MenuBar styling with Tailwind if needed */
.p-menubar-light {
  background-color: transparent;
  border: none;
}
.p-menubar-dark {
  background-color: transparent;
  border: none;
}
</style>
