<template>
  <table
    class="min-w-full table-auto border-collapse border border-gray-300 dark:border-gray-600 dark:text-white"
  >
    <thead class="bg-gray-100 dark:bg-gray-700">
      <tr>
        <th
          v-for="col in columns"
          :key="col.field"
          class="border px-4 py-2 text-start"
        >
          {{ col.label }}
        </th>
        <th v-if="actions?.length" class="border px-4 py-2 text-start">
          Actions
        </th>
      </tr>
    </thead>
    <!-- table body -->
    <tbody>
      <tr
        v-for="item in items"
        :key="item.id"
        class="hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <td v-for="col in columns" :key="col.field" class="border px-4 py-2">
          {{ item[col.field] }}
        </td>
        <td v-if="actions?.length" class="border px-4 py-2">
          <template v-for="(action, index) in actions" :key="index">
            <Button
              v-if="action.permission"
              :key="index"
              :icon="action.icon"
              :class="action.class"
              @click="(e) => action.handler(item, e)"
            />
          </template>
        </td>
      </tr>
    </tbody>
    <!-- table body -->
  </table>
</template>

<script setup lang="ts">
import Button from "primevue/button";

defineProps<{
  columns: Array<{ label: string; field: string }>;
  items: Record<string, any>[];
  actions?: Array<{
    icon: string;
    class?: string;
    permission: boolean;
    handler: (item: any, event: Event) => void;
  }>;
}>();
</script>
