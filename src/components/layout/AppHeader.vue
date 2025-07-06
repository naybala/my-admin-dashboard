<script setup lang="ts">
import { useThemeStore } from "../../stores/theme";
import { useI18n } from "vue-i18n";
import Button from "primevue/button";
import { useAuthStore } from "../../stores/auth";
import { useRouter } from "vue-router";

const emit = defineEmits(["toggle-sidebar"]);
const themeStore = useThemeStore();
const { locale } = useI18n();
const authStore = useAuthStore();
const router = useRouter();

const changeLocale = () => {
  locale.value = locale.value === "en" ? "mm" : "en";
};

const handleLogout = () => {
  authStore.clearToken();
  router.push("/login");
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
    </div>

    <div class="flex items-center space-x-4">
      <Button
        label="Logout"
        icon="pi pi-sign-out"
        severity="danger"
        outlined
        class="ml-2"
        @click="handleLogout"
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
