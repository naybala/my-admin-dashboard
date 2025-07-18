<template>
  <div class="mb-4">
    <label
      :for="id"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {{ label }}
    </label>
    <Select
      :id="id"
      :modelValue="modelValue"
      @update:modelValue="updateValue"
      :options="options"
      optionLabel="name"
      optionValue="id"
      :placeholder="placeholder"
      :filter="true"
      filterPlaceholder="Search..."
      class="w-full p-inputtext-sm dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600"
    />
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { Select } from "primevue";
defineProps<{
  id: string;
  modelValue: number | null;
  options: Array<{ id: number; name: string }>;
  label: string;
  placeholder: string;
  error?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

function updateValue(value: number | null) {
  emit("update:modelValue", value);
}
</script>
