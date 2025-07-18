<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { usePermissionStore } from "@stores/permission";

const props = defineProps<{ isOpen: boolean }>();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const permissionStore = usePermissionStore();

type CustomRouteMeta = {
  sidebar?: boolean;
  label?: any;
  icon?: string;
  permission?: string;
};

const sidebarLinks = computed(() => {
  if (!permissionStore.ready) return [];
  return router.getRoutes().filter((r) => {
    const meta = r.meta as CustomRouteMeta;
    return (
      meta.sidebar &&
      (!meta.permission || permissionStore.hasPermission(meta.permission))
    );
  });
});

function isActiveBasePath(basePath: string) {
  return route.path.startsWith(basePath);
}
</script>

<template>
  <aside
    :class="{ 'w-64': props.isOpen, 'w-20': !props.isOpen }"
    class="bg-gray-800 dark:bg-gray-950 text-white h-screen transition-all duration-300 flex-shrink-0 relative z-10 overflow-hidden"
  >
    <div
      class="p-4 text-center font-bold text-xl border-b border-gray-700 dark:border-gray-800"
    >
      <span v-if="props.isOpen">{{ t("dashboardTitle") }}</span>
      <span v-else>{{ t("dashboardShortTitle") }}</span>
    </div>
    <nav class="mt-4">
      <ul>
        <li v-for="link in sidebarLinks" :key="link.path">
          <RouterLink
            :to="link.path"
            class="flex items-center p-4 hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors duration-200"
            :class="[
              { 'justify-center': !props.isOpen },
              isActiveBasePath(link.path) ? 'bg-blue-600 dark:bg-blue-800' : '',
            ]"
          >
            <i :class="[link.meta.icon, props.isOpen ? 'mr-3' : 'mr-0']"></i>
            <span :class="{ hidden: !props.isOpen, inline: props.isOpen }">
              {{ t((link.meta as CustomRouteMeta).label || "") }}
            </span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>
