<script setup lang="ts">
import { defineProps } from "vue";
import { RouterLink } from "vue-router";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  isOpen: boolean;
}>();

const { t } = useI18n();
</script>

<template>
  <aside
    :class="{ 'w-64': props.isOpen, 'w-0 overflow-hidden': !props.isOpen }"
    class="bg-gray-800 dark:bg-gray-950 text-white h-screen transition-all duration-300 flex-shrink-0"
  >
    <div
      class="p-4 text-center font-bold text-xl border-b border-gray-700 dark:border-gray-800"
    >
      Admin Dashboard
    </div>
    <nav class="mt-4">
      <ul>
        <li>
          <RouterLink
            to="/"
            class="flex items-center p-4 hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors duration-200"
            active-class="bg-blue-600 dark:bg-blue-800"
          >
            <i class="pi pi-home mr-3"></i>
            <span>{{ t("sidebar.dashboard") }}</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/products"
            class="flex items-center p-4 hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors duration-200"
            active-class="bg-blue-600 dark:bg-blue-800"
          >
            <i class="pi pi-box mr-3"></i>
            <span>{{ t("sidebar.products") }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>
