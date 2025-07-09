<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import InputText from "primevue/inputtext";

defineProps<{
  modelValue: string | undefined;
  label: string;
  error?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const updateValue = (value: string | undefined) => {
  emit("update:modelValue", value ?? "");
};
</script>

<template>
  <div class="mb-4">
    <label
      for="name"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {{ label }}
    </label>
    <InputText
      id="name"
      :modelValue="modelValue"
      @update:modelValue="updateValue"
      class="w-full p-inputtext-sm dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 px-2"
    />
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
  </div>
</template>
