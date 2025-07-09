<template>
  <div class="mb-4">
    <label
      for="description"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {{ label }}
    </label>
    <Textarea
      id="description"
      :modelValue="modelValue"
      @update:modelValue="updateValue"
      rows="5"
      class="w-full p-inputtext-sm dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 px-2"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import Textarea from "primevue/textarea";

defineProps<{
  modelValue: string | undefined;
  label: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const updateValue = (value: string | undefined) => {
  emit("update:modelValue", value ?? "");
};
</script>
