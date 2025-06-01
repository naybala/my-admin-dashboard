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
    :class="{ 'w-64': props.isOpen, 'w-20': !props.isOpen }"
    class="bg-gray-800 dark:bg-gray-950 text-white h-screen transition-all duration-300 flex-shrink-0 relative z-10 overflow-hidden"
  >
    <div
      class="p-4 text-center font-bold text-xl border-b border-gray-700 dark:border-gray-800"
    >
      <span v-if="props.isOpen">{{ $t("dashboardTitle") }}</span>
      <span v-else>{{ $t("dashboardShortTitle") }}</span>
    </div>
    <nav class="mt-4">
      <ul>
        <li>
          <RouterLink
            to="/"
            class="flex items-center p-4 hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors duration-200"
            :class="{ 'justify-center': !props.isOpen }"
            active-class="bg-blue-600 dark:bg-blue-800"
          >
            <i
              class="pi pi-home"
              :class="{ 'mr-0': !props.isOpen, 'mr-3': props.isOpen }"
            ></i>
            <span :class="{ hidden: !props.isOpen, inline: props.isOpen }">{{
              t("sidebar.dashboard")
            }}</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/products"
            class="flex items-center p-4 hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors duration-200"
            :class="{ 'justify-center': !props.isOpen }"
            active-class="bg-blue-600 dark:bg-blue-800"
          >
            <i
              class="pi pi-box"
              :class="{ 'mr-0': !props.isOpen, 'mr-3': props.isOpen }"
            ></i>
            <span :class="{ hidden: !props.isOpen, inline: props.isOpen }">{{
              t("sidebar.products")
            }}</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/categories"
            class="flex items-center p-4 hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors duration-200"
            :class="{ 'justify-center': !props.isOpen }"
            active-class="bg-blue-600 dark:bg-blue-800"
          >
            <i
              class="pi pi-tags"
              :class="{ 'mr-0': !props.isOpen, 'mr-3': props.isOpen }"
            ></i>
            <span :class="{ hidden: !props.isOpen, inline: props.isOpen }">{{
              t("sidebar.categories")
            }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>
