<script setup lang="ts">
import { useThemeStore } from "../../stores/theme";
import { useI18n } from "vue-i18n";
import Button from "primevue/button";
import InputText from "primevue/inputtext";

const emit = defineEmits(["toggle-sidebar"]);
const themeStore = useThemeStore();
const { locale } = useI18n();

const changeLocale = () => {
  locale.value = locale.value === "en" ? "mm" : "en";
};
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
        class="p-inputtext-sm dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 px-2"
      />

      <Button
        :icon="themeStore.isDark ? 'pi pi-sun' : 'pi pi-moon'"
        severity="secondary"
        text
        rounded
        aria-label="Toggle Theme"
        @click="themeStore.toggleTheme"
      />

      <div>
        <img
          :src="locale === 'en' ? '/mm.webp' : '/en.jpeg'"
          alt="Language Toggle"
          class="w-9 cursor-pointer rounded-lg"
          @click="changeLocale"
        />
      </div>
    </div>
  </header>
</template>

<style scoped>
.p-menubar-light,
.p-menubar-dark {
  background-color: transparent;
  border: none;
}
</style>
